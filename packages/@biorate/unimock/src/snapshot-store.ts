import { existsSync, mkdirSync, readFileSync, openSync, closeSync, writeSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import type {
  SerializedValue,
  SnapshotCall,
  SnapshotFile,
  SnapshotStoreEntry,
  UnimockMode,
} from './interfaces';
import {
  parseUnimockMode,
  resolveSnapshotDir,
  gzipEnabled,
  valuePoolEnabled,
  valuePoolThreshold,
  valuePoolCountLimit,
} from './env';
import {
  SEPARATOR_STORE,
  SNAPSHOT_FILE_VERSION,
  DEFAULT_SNAPSHOT_EXT,
  MODE_RECORD,
  MODE_REPLAY,
  MODE_OFF,
  T_POOLED_STRING,
  T_POOLED_VALUE,
  T_STRING,
  T_ARRAY,
  T_OBJECT,
  HASH_ALGORITHM,
  HASH_ENCODING,
} from './constants';
import { stableStringify } from './serializer';

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
 *   - **Streaming JSONL** format: header, `_t:'s'` pooled-string lines, `_t:'v'` pooled-value
 *     lines, and `_t:'c'` call lines. Incremental append-only flush (no full rewrites after the
 *     first flush) keeps record O(N) and memory bounded.
 *   - Multi-member gzip: each 500-line batch is compressed standalone so appended members stay
 *     readable by `gunzipSync` without re-reading the whole file.
 *   - **String pooling**: strings >500 B are deduplicated into a shared `_t:'s'` dictionary.
 *   - **Value pooling** (content-addressable, `UNIMOCK_VALUE_POOL*`): large serialized subtrees
 *     (>100 KB default) are stored once as `_t:'v'` blobs and referenced from call entries. The
 *     dedup index survives flushes, so identical subtrees repeat across records are written only
 *     once (Sqquelize `include`/`build`/`set` trees collapse ~4x).
 *   - Transparent de-pooling on read — replay code never sees `pooled_string`/`pooled_value`.
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

  /** @description Maximum nested wrapping depth (default: `Infinity`). Set by `@Mockable({ depth })`. */
  public depth = Infinity;

  private data: SnapshotFile;

  private dirty = false;

  private stringPool: Map<string, string>;

  private poolCounter = 0;

  private valuePool: Map<string, SerializedValue>;

  private valueIndex: Map<string, string>;

  private valueCounter = 0;

  private pendingKeys: Set<string>;

  private pendingStrings: Set<string>;

  private pendingValues: Set<string>;

  private jsonlOnDisk = false;

  private jsonlHeaderWritten = false;

  /**
   * @param className - class name used for the snapshot filename
   * @param snapshotDir - optional directory override
   * @param importMeta - pass `import.meta` from calling module to resolve snapshot dir relative to it
   */
  public constructor(className: string, snapshotDir?: string, importMeta?: ImportMeta) {
    this.className = className;
    const baseDir = resolveSnapshotDir(snapshotDir, importMeta);
    this.snapshotPath = resolve(baseDir, `${className}.unimock${DEFAULT_SNAPSHOT_EXT}`);
    this.stringPool = new Map();
    this.valuePool = new Map();
    this.valueIndex = new Map();
    this.pendingKeys = new Set();
    this.pendingStrings = new Set();
    this.pendingValues = new Set();
    this.data = this.load();
  }

  private load(): SnapshotFile {
    try {
      if (existsSync(this.snapshotPath)) {
        const raw = readFileSync(this.snapshotPath);
        const gzipped = raw[0] === 0x1f && raw[1] === 0x8b;
        const buf = gzipped ? gunzipSync(raw) : raw;
        if (buf.length > 0 && this.isJsonl(buf)) {
          this.jsonlOnDisk = true;
          this.jsonlHeaderWritten = true;
          return this.loadJsonl(buf);
        }
        const parsed = JSON.parse(buf.toString('utf-8')) as SnapshotFile;
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

  private isJsonl(buf: Buffer): boolean {
    if (buf.length < 16) return false;
    const head = buf.subarray(0, 16).toString('utf-8');
    return head.includes('"_fmt"') || head.includes('"_jsonl"');
  }

  private loadJsonl(buf: Buffer): SnapshotFile {
    const parsed: SnapshotFile = {
      version: SNAPSHOT_FILE_VERSION,
      className: this.className,
      calls: {},
    };
    let maxStringRef = -1;
    let maxValueRef = -1;
    for (const line of splitLines(buf)) {
      if (!line) continue;
      let rec: unknown;
      try {
        rec = JSON.parse(line);
      } catch {
        continue;
      }
      if (rec && typeof rec === 'object' && (rec as { _t?: string })._t === 's') {
        const { ref, val } = rec as { ref: string; val: string };
        if (typeof ref === 'string' && typeof val === 'string') {
          this.stringPool.set(ref, val);
          if (ref.startsWith('$')) {
            const idx = parseInt(ref.slice(1), 10);
            if (idx > maxStringRef) maxStringRef = idx;
          }
        }
      } else if (rec && typeof rec === 'object' && (rec as { _t?: string })._t === 'v') {
        const { ref, val } = rec as { ref: string; val: SerializedValue };
        if (typeof ref === 'string' && val && typeof val === 'object') {
          this.valuePool.set(ref, val);
          if (ref.startsWith('@')) {
            const idx = parseInt(ref.slice(1), 10);
            if (idx > maxValueRef) maxValueRef = idx;
          }
        }
      } else if (rec && typeof rec === 'object' && (rec as { _t?: string })._t === 'c') {
        const { key, call } = rec as { key: string; call: SnapshotCall };
        if (typeof key === 'string' && call && typeof call === 'object') {
          parsed.calls[key] = call;
        }
      }
    }
    if (maxStringRef >= 0) this.poolCounter = maxStringRef + 1;
    if (maxValueRef >= 0) this.valueCounter = maxValueRef + 1;
    return parsed;
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
      // Optional per-instance refId markup (absent on legacy entries — kept as-is).
      ...(call.refs !== undefined ? { refs: call.refs } : {}),
    };
  }

  public record(callKey: string, call: SnapshotCall): void {
    this.data.calls[callKey] = {
      args: call.args.map((a) => this.poolValue(a)),
      result: this.poolValue(call.result),
      error: call.error ? this.poolValue(call.error) : undefined,
      // Optional per-instance refId markup (absent on legacy entries — kept as-is).
      ...(call.refs !== undefined ? { refs: call.refs } : {}),
    };
    this.pendingKeys.add(callKey);
    this.dirty = true;
  }

  public flush(): void {
    if (!this.dirty) return;
    const dir = dirname(this.snapshotPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (!this.jsonlOnDisk) {
      this.writeJsonlFull();
    } else {
      this.appendJsonl();
    }
    this.dirty = false;
  }

  private writeJsonlFull(): void {
    const gz = gzipEnabled();
    const fd = openSync(this.snapshotPath, 'w');
    const batch: string[] = [];
    const flushBatch = () => {
      if (batch.length === 0) return;
      const content = batch.join('\n') + '\n';
      batch.length = 0;
      const buf = Buffer.from(content, 'utf-8');
      if (gz) writeSync(fd, gzipSync(buf, { level: 9 }));
      else writeSync(fd, buf);
    };
    try {
      batch.push(JSON.stringify({ _jsonl: 1, className: this.className }));
      for (const [ref, value] of this.stringPool) {
        batch.push(JSON.stringify({ _t: 's', ref, val: value }));
        if (batch.length >= 500) flushBatch();
      }
      for (const [ref, value] of this.valuePool) {
        batch.push(JSON.stringify({ _t: 'v', ref, val: value }));
        if (batch.length >= 500) flushBatch();
      }
      for (const [key, call] of Object.entries(this.data.calls)) {
        batch.push(JSON.stringify({ _t: 'c', key, call }));
        if (batch.length >= 500) flushBatch();
      }
      flushBatch();
    } finally {
      closeSync(fd);
    }
    this.jsonlOnDisk = true;
    this.jsonlHeaderWritten = true;
    // Keep calls, stringPool and valuePool resident: replay may run in the same process
    // (record -> flushAllSnapshots -> setMode('replay') -> get) and in-memory entries must
    // still resolve, including pooled strings/values. Only pending markers are cleared.
    this.pendingKeys.clear();
    this.pendingStrings.clear();
    this.pendingValues.clear();
  }

  private appendJsonl(): void {
    const gz = gzipEnabled();
    const fd = openSync(this.snapshotPath, 'a');
    const batch: string[] = [];
    const flushBatch = () => {
      if (batch.length === 0) return;
      const content = batch.join('\n') + '\n';
      batch.length = 0;
      const buf = Buffer.from(content, 'utf-8');
      if (gz) writeSync(fd, gzipSync(buf, { level: 9 }));
      else writeSync(fd, buf);
    };
    try {
      for (const ref of this.pendingStrings) {
        const value = this.stringPool.get(ref);
        if (value !== undefined) {
          batch.push(JSON.stringify({ _t: 's', ref, val: value }));
          if (batch.length >= 500) flushBatch();
        }
      }
      for (const ref of this.pendingValues) {
        const value = this.valuePool.get(ref);
        if (value !== undefined) {
          batch.push(JSON.stringify({ _t: 'v', ref, val: value }));
          if (batch.length >= 500) flushBatch();
        }
      }
      for (const key of this.pendingKeys) {
        const call = this.data.calls[key];
        if (call !== undefined) {
          batch.push(JSON.stringify({ _t: 'c', key, call }));
          if (batch.length >= 500) flushBatch();
        }
      }
      flushBatch();
    } finally {
      closeSync(fd);
    }
    this.pendingKeys.clear();
    this.pendingStrings.clear();
    this.pendingValues.clear();
  }

  private getStringRef(value: string): string {
    for (const [ref, v] of this.stringPool) {
      if (v === value) return ref;
    }
    const ref = `$${this.poolCounter++}`;
    this.stringPool.set(ref, value);
    this.pendingStrings.add(ref);
    return ref;
  }

  private resolveStringRef(ref: string): string | undefined {
    return this.stringPool.get(ref);
  }

  private getValueRef(value: SerializedValue): string {
    const s = stableStringify(value);
    const h = createHash(HASH_ALGORITHM).update(s).digest(HASH_ENCODING);
    const existing = this.valueIndex.get(h);
    if (existing) return existing;
    const ref = `@${this.valueCounter++}`;
    this.valueIndex.set(h, ref);
    this.valuePool.set(ref, value);
    this.pendingValues.add(ref);
    return ref;
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
      if (valuePoolEnabled() && (x.t === T_ARRAY || x.t === T_OBJECT)) {
        if (this.isLargeValue(x)) {
          return { t: T_POOLED_VALUE, v: this.getValueRef(x) };
        }
      }
      if (x.t === T_STRING && typeof x.v === 'string' && x.v.length > POOL_THRESHOLD) {
        return { t: T_POOLED_STRING, v: this.getStringRef(x.v) };
      }
      return x;
    });
  }

  private isLargeValue(v: SerializedValue): boolean {
    let count = 0;
    const stack: SerializedValue[] = [v];
    while (stack.length) {
      const cur = stack.pop()!;
      if (++count > valuePoolCountLimit()) return true;
      if (cur.t === T_ARRAY && Array.isArray(cur.v)) {
        for (const item of cur.v) stack.push(item);
      } else if (cur.t === T_OBJECT && Array.isArray(cur.v)) {
        for (const entry of cur.v) stack.push(entry.v);
      }
    }
    if (count <= valuePoolCountLimit()) return false;
    return stableStringify(v).length > valuePoolThreshold();
  }

  private depoolValue(v: SerializedValue): SerializedValue {
    return this.visitSerialized(v, (x) => {
      if (x.t === T_POOLED_STRING && typeof x.v === 'string') {
        const value = this.resolveStringRef(x.v);
        if (value) return { t: T_STRING, v: value };
      }
      if (x.t === T_POOLED_VALUE && typeof x.v === 'string') {
        const value = this.valuePool.get(x.v);
        if (value) return value;
      }
      return x;
    });
  }
}

/**
 * @description Splits a buffer into lines without materialising it as one giant string.
 *   Uses `subarray(pos).indexOf(0x0a)` so the searched offset stays relative to a small view —
 *   `Buffer.indexOf` on absolute offsets wraps into a negative int32 at locations >= 2^31,
 *   which would be misinterpreted as "not found" and collapse the tail into a single line.
 */
function splitLines(buf: Buffer): string[] {
  const lines: string[] = [];
  let pos = 0;
  while (pos < buf.length) {
    const relEnd = buf.subarray(pos).indexOf(0x0a);
    let end: number;
    if (relEnd < 0) end = buf.length;
    else end = pos + relEnd;
    if (end > pos) {
      lines.push(buf.subarray(pos, end).toString('utf-8'));
    }
    pos = end + 1;
  }
  return lines;
}

/**
 * @description Returns (or creates) the {@link SnapshotStore} for a given class and snapshot
 *   directory. Stores are cached globally by `className + snapshotDir`.
 *
 * @param className - class name (snapshot filename stem)
 * @param snapshotDir - optional custom directory
 * @param importMeta - pass `import.meta` from calling module to resolve snapshot dir relative to it
 */
export function getSnapshotStore(
  className: string,
  snapshotDir?: string,
  importMeta?: ImportMeta,
): SnapshotStore {
  const key = `${className}${SEPARATOR_STORE}${snapshotDir ?? importMeta?.url ?? ''}`;
  let store = stores.get(key);
  if (!store) {
    store = new SnapshotStore(className, snapshotDir, importMeta);
    stores.set(key, store);
  }
  return store;
}

/**
 * @description Flushes all dirty snapshot stores to disk. Only does work in `'record'` mode.
 *   Automatically called by the vitest setup hook (`vitest/setup.ts`).
 */
export function flushAllSnapshots(): void {
  if (!isRecord()) return;
  for (const store of stores.values()) store.flush();
}

/**
 * @description Returns `true` when the current global mode is `'replay'`.
 *   Always reads `SnapshotStore.mode`, so it works correctly after
 *   {@link SnapshotStore.setMode}. Replaces manual `store.mode === MODE_REPLAY` checks.
 */
export function isReplay(): boolean {
  return SnapshotStore.mode === MODE_REPLAY;
}

/**
 * @description Returns `true` when the current global mode is `'record'`.
 *   Always reads `SnapshotStore.mode`, so it works correctly after
 *   {@link SnapshotStore.setMode}. Replaces manual `SnapshotStore.mode !== 'record'` checks.
 */
export function isRecord(): boolean {
  return SnapshotStore.mode === MODE_RECORD;
}

/**
 * @description Returns `true` when the current global mode is `'off'`.
 *   Always reads `SnapshotStore.mode`, so it works correctly after
 *   {@link SnapshotStore.setMode}. Lets method wrappers short-circuit to the
 *   original implementation with zero overhead (no call-key computation).
 */
export function isOff(): boolean {
  return SnapshotStore.mode === MODE_OFF;
}

export { SnapshotStore as SnapshotStoreClass };