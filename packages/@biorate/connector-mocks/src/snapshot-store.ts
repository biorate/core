import * as fs from 'fs';
import * as path from 'path';

export interface SnapshotData {
  args: any[];
  result: any;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface SnapshotStore {
  save(key: string, data: SnapshotData): Promise<void>;
  load(key: string): Promise<SnapshotData | null>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  delete?(key: string): Promise<boolean>;
}

const vitest = globalThis as any;

export interface FileSnapshotStoreOptions {
  snapshotsDir?: string;
  fileExtension?: string;
  indent?: number;
  sortKeys?: boolean;
}

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

  private getSnapshotFilePath(): string {
    const state = vitest.expect?.getState?.();
    const currentTestPath = state?.currentTestPath ?? state?.testPath;

    if (currentTestPath) {
      const snapshotsDir = path.isAbsolute(this.options.snapshotsDir)
        ? this.options.snapshotsDir
        : path.join(path.dirname(currentTestPath), this.options.snapshotsDir);
      const testFileName = path.basename(currentTestPath, path.extname(currentTestPath));
      return path.join(snapshotsDir, `${testFileName}${this.options.fileExtension}`);
    }

    return path.join(this.options.snapshotsDir, `default${this.options.fileExtension}`);
  }

  private async loadFileToCache(filePath: string): Promise<Map<string, SnapshotData>> {
    if (this.fileCache.has(filePath)) {
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
    } catch {
      // File doesn't exist or is corrupted - start fresh
    }

    this.fileCache.set(filePath, fileData);
    return fileData;
  }

  private async saveCacheToFile(
    filePath: string,
    fileData: Map<string, SnapshotData>,
  ): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const entries = Array.from(fileData.entries());
      if (this.options.sortKeys) {
        entries.sort((a, b) => a[0].localeCompare(b[0]));
      }

      const obj = Object.fromEntries(entries);
      const content = JSON.stringify(obj, null, this.options.indent) + '\n';

      fs.writeFileSync(filePath, content, 'utf-8');
    } catch {
      // Ignore save errors
    }
  }

  async save(key: string, data: SnapshotData): Promise<void> {
    const filePath = this.getSnapshotFilePath();
    const fileData = await this.loadFileToCache(filePath);
    const existing = fileData.get(key);

    if (existing?.timestamp) {
      data.timestamp = existing.timestamp;
    } else if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    this.cache.set(key, data);
    fileData.set(key, data);
    await this.saveCacheToFile(filePath, fileData);
  }

  async load(key: string): Promise<SnapshotData | null> {
    const cached = this.cache.get(key);
    if (cached) return cached;

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
    const filePath = this.getSnapshotFilePath();
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch {
      // Ignore
    }
    this.fileCache.clear();
  }

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
