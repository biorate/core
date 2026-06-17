import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import type {
  SerializedValue,
  SnapshotCall,
  SnapshotFile,
  SnapshotStoreEntry,
  UnimockMode,
} from './interfaces';
import { parseUnimockMode, resolveSnapshotDir, gzipEnabled } from './env';
import {
  SEPARATOR_STORE,
  SNAPSHOT_FILE_VERSION,
  DEFAULT_SNAPSHOT_EXT,
  T_POOLED_STRING,
  T_STRING,
  T_ARRAY,
  T_OBJECT,
} from './constants';

const stores = new Map<string, SnapshotStore>();

const POOL_THRESHOLD = 500;

/**
 * @description Per-class snapshot store that manages loading, recording, and persisting
 *   snapshot data.
 *
 *   Each decorated class gets its own `SnapshotStore` instance, cached by `className + snapshotDir`.
 *   The store is shared across all instances of the decorated class within the same process.
 *
 *   ### Features:
 *   - Automatic gzip detection and compression (`UNIMOCK_GZIP=1`).
 *   - String pooling: strings >500 B are deduplicated into a shared dictionary within the file.
 *   - Transparent de-pooling on read — replay code never sees `pooled_string` entries.
 */
export class SnapshotStore implements SnapshotStoreEntry {
  private static _mode: UnimockMode = parseUnimockMode();

  /** @description Current global operating mode. */
  public static get mode(): UnimockMode {
    return SnapshotStore._mode;
  }

  /** @description Sets the global operating mode. */
  public static setMode(mode: UnimockMode): void {
    SnapshotStore._mode = mode;
  }

  /** @description Name of the mocked class (from `Base.name`). */
  public readonly className: string;

  /** @description Absolute path to the snapshot file on disk. */
  public readonly snapshotPath: string;

  /** @description Enable symbol serialization (default: `false`). Set by `@Mockable({ symbols: true })`. */
  public symbols = false;

  private data: SnapshotFile;

  private dirty = false;

  private stringPool: Map<string, string>;

  private poolCounter = 0;

  /**
   * @param className - class name used for the snapshot filename
   * @param snapshotDir - optional directory override
   */
  public constructor(className: string, snapshotDir?: string) {
    this.className = className;
    const baseDir = resolveSnapshotDir(snapshotDir);
    this.snapshotPath = resolve(baseDir, `${className}.unimock${DEFAULT_SNAPSHOT_EXT}`);
    this.stringPool = new Map();
    this.data = this.load();
  }

  private load(): SnapshotFile {
    try {
      if (existsSync(this.snapshotPath)) {
        const raw = readFileSync(this.snapshotPath);
        let parsed: SnapshotFile;
        if (raw[0] === 0x7b) {
          parsed = JSON.parse(raw.toString('utf-8')) as SnapshotFile;
        } else {
          parsed = JSON.parse(gunzipSync(raw).toString('utf-8')) as SnapshotFile;
        }
        if (parsed.strings) {
          for (const [ref, value] of Object.entries(parsed.strings)) {
            this.stringPool.set(ref, value);
          }
          this.poolCounter = Object.keys(parsed.strings).length;
        }
        return parsed;
      }
    } catch {
      // corrupt file — start fresh
    }
    return { version: SNAPSHOT_FILE_VERSION, className: this.className, calls: {} };
  }

  public get mode(): UnimockMode {
    return SnapshotStore.mode;
  }

  public has(callKey: string): boolean {
    return callKey in this.data.calls;
  }

  public get(callKey: string): SnapshotCall | undefined {
    const call = this.data.calls[callKey];
    if (!call) return undefined;
    return {
      args: call.args.map((a) => this.depoolValue(a)),
      result: this.depoolValue(call.result),
      error: call.error ? this.depoolValue(call.error) : undefined,
    };
  }

  public record(callKey: string, call: SnapshotCall): void {
    this.data.calls[callKey] = {
      args: call.args.map((a) => this.poolValue(a)),
      result: this.poolValue(call.result),
      error: call.error ? this.poolValue(call.error) : undefined,
    };
    this.dirty = true;
  }

  public flush(): void {
    if (!this.dirty) return;
    const dir = dirname(this.snapshotPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (this.stringPool.size > 0) {
      const strings: Record<string, string> = {};
      for (const [ref, value] of this.stringPool) {
        strings[ref] = value;
      }
      this.data.strings = strings;
    } else {
      delete this.data.strings;
    }

    const content = JSON.stringify(this.data);
    if (gzipEnabled()) {
      writeFileSync(this.snapshotPath, gzipSync(content, { level: 9 }));
    } else {
      writeFileSync(this.snapshotPath, content, 'utf-8');
    }
    this.dirty = false;
  }

  private getStringRef(value: string): string {
    for (const [ref, v] of this.stringPool) {
      if (v === value) return ref;
    }
    const ref = `$${this.poolCounter++}`;
    this.stringPool.set(ref, value);
    return ref;
  }

  private resolveStringRef(ref: string): string | undefined {
    return this.stringPool.get(ref);
  }

  private visitSerialized(
    v: SerializedValue,
    visit: (v: SerializedValue) => SerializedValue,
  ): SerializedValue {
    const result = visit(v);
    if (result.t === T_ARRAY && Array.isArray(result.v)) {
      return {
        t: T_ARRAY,
        v: result.v.map((item) => this.visitSerialized(item as SerializedValue, visit)),
      };
    }
    if (result.t === T_OBJECT && Array.isArray(result.v)) {
      return {
        t: T_OBJECT,
        v: result.v.map((entry) => ({
          k: entry.k,
          v: this.visitSerialized(entry.v as SerializedValue, visit),
        })),
      };
    }
    return result;
  }

  private poolValue(v: SerializedValue): SerializedValue {
    return this.visitSerialized(v, (x) => {
      if (x.t === T_STRING && typeof x.v === 'string' && x.v.length > POOL_THRESHOLD) {
        return { t: T_POOLED_STRING, v: this.getStringRef(x.v) };
      }
      return x;
    });
  }

  private depoolValue(v: SerializedValue): SerializedValue {
    return this.visitSerialized(v, (x) => {
      if (x.t === T_POOLED_STRING && typeof x.v === 'string') {
        const value = this.resolveStringRef(x.v);
        if (value) return { t: T_STRING, v: value };
      }
      return x;
    });
  }
}

/**
 * @description Returns (or creates) the {@link SnapshotStore} for a given class and snapshot
 *   directory. Stores are cached globally by `className + snapshotDir`.
 *
 * @param className - class name (snapshot filename stem)
 * @param snapshotDir - optional custom directory
 */
export function getSnapshotStore(className: string, snapshotDir?: string): SnapshotStore {
  const key = `${className}${SEPARATOR_STORE}${snapshotDir ?? ''}`;
  let store = stores.get(key);
  if (!store) {
    store = new SnapshotStore(className, snapshotDir);
    stores.set(key, store);
  }
  return store;
}

/**
 * @description Flushes all dirty snapshot stores to disk. Only does work in `'record'` mode.
 *   Automatically called by the vitest setup hook (`vitest/setup.ts`).
 */
export function flushAllSnapshots(): void {
  if (SnapshotStore.mode !== 'record') return;
  for (const store of stores.values()) store.flush();
}

export { SnapshotStore as SnapshotStoreClass };
