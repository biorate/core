import * as fs from 'fs';
import * as path from 'path';

/**
 * @description Snapshot data structure
 */
export interface SnapshotData {
  /**
   * @description Method arguments
   */
  args: any[];
  /**
   * @description Method result
   */
  result: any;
  /**
   * @description Timestamp when snapshot was recorded (ISO 8601)
   */
  timestamp?: string;
  /**
   * @description Optional metadata (e.g., query duration, connection name)
   */
  metadata?: Record<string, any>;
}

/**
 * @description Interface for snapshot storage
 */
export interface SnapshotStore {
  save(key: string, data: SnapshotData): Promise<void>;
  load(key: string): Promise<SnapshotData | null>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  delete?(key: string): Promise<boolean>;
}

const vitest = globalThis as any;

/**
 * @description Vitest-based snapshot store
 *
 * Uses Vitest's snapshot assertion for recording and caching.
 * In replay mode, reads from the snapshot cache.
 *
 * @deprecated Use FileSnapshotStore for persistent snapshots
 */
export class VitestSnapshotStore implements SnapshotStore {
  private cache = new Map<string, SnapshotData>();

  async save(key: string, data: SnapshotData): Promise<void> {
    this.cache.set(key, data);
    const expect = vitest.expect;
    if (expect) {
      expect(data).toMatchSnapshot(key);
    }
  }

  async load(key: string): Promise<SnapshotData | null> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const expect = vitest.expect;
    if (expect) {
      try {
        const placeholder = { __snapshot_key: key };
        expect(placeholder).toMatchSnapshot(key);
      } catch {
        // Snapshot doesn't exist
      }
    }
    return this.cache.get(key) || null;
  }

  async has(key: string): Promise<boolean> {
    if (this.cache.has(key)) return true;
    const snapshot = await this.load(key);
    return snapshot !== null;
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }
}

/**
 * @description Options for FileSnapshotStore
 */
export interface FileSnapshotStoreOptions {
  /**
   * @description Directory for snapshot files (default: __snapshots__ in test dir)
   */
  snapshotsDir?: string;

  /**
   * @description File extension for snapshots (default: '.snap.json')
   */
  fileExtension?: string;

  /**
   * @description Pretty-print JSON with indent (default: 2)
   */
  indent?: number;

  /**
   * @description Sort snapshot keys alphabetically (default: true)
   */
  sortKeys?: boolean;
}

/**
 * @description File-based snapshot store
 *
 * Stores snapshots as JSON files on disk. Each test file gets its own
 * snapshot file in __snapshots__ directory.
 *
 * Snapshot file format:
 * ```json
 * {
 *   "ConnectorNamespace.methodName": {
 *     "args": [...],
 *     "result": {...},
 *     "timestamp": "2026-05-28T10:00:00.000Z"
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * const store = new FileSnapshotStore({
 *   snapshotsDir: path.join(process.cwd(), '__snapshots__'),
 *   fileExtension: '.mocks.json'
 * });
 * ```
 */
export class FileSnapshotStore implements SnapshotStore {
  private cache = new Map<string, SnapshotData>();
  private fileCache = new Map<string, Map<string, SnapshotData>>();
  private options: Required<FileSnapshotStoreOptions>;

  constructor(options: FileSnapshotStoreOptions = {}) {
    this.options = {
      snapshotsDir: options.snapshotsDir ?? '__snapshots__',
      fileExtension: options.fileExtension ?? '.snap.json',
      indent: options.indent ?? 2,
      sortKeys: options.sortKeys ?? true,
    };
  }

  /**
   * @description Get snapshot file path for current test file
   */
  private getSnapshotFilePath(): string {
    // Try to get current test file from Vitest
    const state = vitest.expect?.getState?.();
    const currentTestPath = state?.currentTestPath ?? state?.testPath;

    if (currentTestPath) {
      // If snapshotsDir is absolute, use it directly; otherwise, resolve relative to test file
      const snapshotsDir = path.isAbsolute(this.options.snapshotsDir)
        ? this.options.snapshotsDir
        : path.join(path.dirname(currentTestPath), this.options.snapshotsDir);
      const testFileName = path.basename(currentTestPath, path.extname(currentTestPath));
      return path.join(snapshotsDir, `${testFileName}${this.options.fileExtension}`);
    }

    // Fallback to current working directory
    return path.join(this.options.snapshotsDir, `default${this.options.fileExtension}`);
  }

  /**
   * @description Load snapshots from file into cache
   */
  private async loadFileToCache(filePath: string): Promise<Map<string, SnapshotData>> {
    if (this.fileCache.has(filePath)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.fileCache.get(filePath)!;
    }

    const fileData = new Map<string, SnapshotData>();

    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content) as Record<string, SnapshotData>;
        for (const [key, value] of Object.entries(parsed)) {
          fileData.set(key, value);
        }
      }
    } catch (error) {
      // File doesn't exist or is corrupted - start fresh
      console.warn(
        `[FileSnapshotStore] Could not load snapshots from ${filePath}:`,
        error,
      );
    }

    this.fileCache.set(filePath, fileData);
    return fileData;
  }

  /**
   * @description Save snapshots from cache to file
   */
  private async saveCacheToFile(
    filePath: string,
    fileData: Map<string, SnapshotData>,
  ): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Convert Map to sorted object
      const entries = Array.from(fileData.entries());
      if (this.options.sortKeys) {
        entries.sort((a, b) => a[0].localeCompare(b[0]));
      }

      const obj = Object.fromEntries(entries);
      const content = JSON.stringify(obj, null, this.options.indent) + '\n';

      fs.writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      console.error(
        `[FileSnapshotStore] Could not save snapshots to ${filePath}:`,
        error,
      );
    }
  }

  async save(key: string, data: SnapshotData): Promise<void> {
    // Preserve existing timestamp if snapshot already exists
    const filePath = this.getSnapshotFilePath();
    const fileData = await this.loadFileToCache(filePath);
    const existing = fileData.get(key);

    if (existing?.timestamp) {
      data.timestamp = existing.timestamp;
    } else if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Update caches
    this.cache.set(key, data);
    fileData.set(key, data);
    await this.saveCacheToFile(filePath, fileData);
  }

  async load(key: string): Promise<SnapshotData | null> {
    // Check in-memory cache first
    const cached = this.cache.get(key);
    if (cached) return cached;

    // Load from file
    const filePath = this.getSnapshotFilePath();
    const fileData = await this.loadFileToCache(filePath);
    return fileData.get(key) || null;
  }

  async has(key: string): Promise<boolean> {
    if (this.cache.has(key)) return true;

    const filePath = this.getSnapshotFilePath();
    const fileData = await this.loadFileToCache(filePath);
    return fileData.has(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    // Also clear file on disk
    const filePath = this.getSnapshotFilePath();
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      // Ignore errors if file doesn't exist or can't be deleted
      console.warn(
        `[FileSnapshotStore] Could not delete snapshot file ${filePath}:`,
        error,
      );
    }
    this.fileCache.clear();
  }

  /**
   * @description Clear all snapshots for current test file
   */
  async clearFile(): Promise<void> {
    const filePath = this.getSnapshotFilePath();
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    this.fileCache.delete(filePath);
  }

  /**
   * @description Remove specific snapshot by key
   */
  async delete(key: string): Promise<boolean> {
    this.cache.delete(key);

    const filePath = this.getSnapshotFilePath();
    const fileData = await this.loadFileToCache(filePath);
    const existed = fileData.delete(key);

    if (existed) {
      await this.saveCacheToFile(filePath, fileData);
    }

    return existed;
  }
}

/**
 * @description In-memory snapshot store for testing
 */
export class MemorySnapshotStore implements SnapshotStore {
  private store = new Map<string, SnapshotData>();

  async save(key: string, data: SnapshotData): Promise<void> {
    this.store.set(key, data);
  }

  async load(key: string): Promise<SnapshotData | null> {
    return this.store.get(key) || null;
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }
}
