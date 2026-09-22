import {
  existsSync,
  mkdirSync,
  readFileSync,
  openSync,
  closeSync,
  writeSync,
} from 'node:fs';
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
  rowPoolEnabled,
  compactEnabled,
} from './env';
import {
  SEPARATOR_STORE,
  SNAPSHOT_FILE_VERSION,
  JSONL_FORMAT_VERSION,
  DEFAULT_SNAPSHOT_EXT,
  MODE_RECORD,
  MODE_REPLAY,
  MODE_OFF,
  T_POOLED_STRING,
  T_POOLED_VALUE,
  T_COMPACT_TABLE,
  T_STRING,
  T_ARRAY,
  T_OBJECT,
  HASH_ALGORITHM,
  HASH_ENCODING,
  POOL_THRESHOLD,
} from './constants';
import { stableStringify } from './serializer';
import { resetRefCounters } from './utils';

const stores = new Map<string, SnapshotStore>();

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

  /**
   * @description Sets the global operating mode. Sweep: the transition into `'record'` (from
   *   replay/off) resets every cached store to a fresh record session, so the file is
   *   rewritten in full on the first flush. Repeating `setMode('record')` while already in
   *   record mode does NOT sweep: the current session stays intact.
   */
  public static setMode(mode: UnimockMode): void {
    const prev = SnapshotStore._mode;
    SnapshotStore._mode = mode;
    if (mode === MODE_RECORD && prev !== MODE_RECORD) {
      resetRefCounters();
      for (const store of stores.values()) {
        store.beginFreshRecordSession();
      }
    }
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

  /**
   * @description Ordered per-key history of every recorded call event (file order), kept
   *   alongside the last-wins `data.calls` so stateful call sites (iterator `next()`) can
   *   be replayed in order.
   */
  private callSeq: Map<string, SnapshotCall[]>;

  private staticReplayCounters = new Map<string, number>();

  private staticReplayWarned = new Set<string>();

  private dirty = false;

  private stringPool: Map<string, string>;

  /** @description Reverse index of pooled strings (value → ref) for O(1) lookups. */
  private stringIndex: Map<string, string>;

  private poolCounter = 0;

  private valuePool: Map<string, SerializedValue>;

  private valueIndex: Map<string, string>;

  private valueCounter = 0;

  private pendingKeys: Set<string>;
  /** Per-callKey count of occurrences already written to the on-disk file (for appends). */
  private flushedSeq: Map<string, number>;

  private pendingStrings: Set<string>;

  private pendingValues: Set<string>;

  private jsonlOnDisk = false;

  private jsonlHeaderWritten = false;

  /**
   * @param className - class name used for the snapshot filename
   * @param snapshotDir - optional directory override
   * @param importMeta - pass `import.meta` from calling module to resolve snapshot dir relative to it
   *
   *   In `'record'` mode the store starts from a clean slate: an existing snapshot file is
   *   NOT loaded (`jsonlOnDisk`/`jsonlHeaderWritten` stay `false`), so the first flush rewrites
   *   the file in full via {@link writeJsonlFull}. Outside record mode the file is loaded as
   *   before.
   */
  public constructor(className: string, snapshotDir?: string, importMeta?: ImportMeta) {
    this.className = className;
    const baseDir = resolveSnapshotDir(snapshotDir, importMeta);
    this.snapshotPath = resolve(baseDir, `${className}.unimock${DEFAULT_SNAPSHOT_EXT}`);
    this.stringPool = new Map();
    this.stringIndex = new Map();
    this.valuePool = new Map();
    this.valueIndex = new Map();
    this.pendingKeys = new Set();
    this.flushedSeq = new Map();
    this.pendingStrings = new Set();
    this.pendingValues = new Set();
    this.callSeq = new Map();
    this.data = isRecord()
      ? { version: SNAPSHOT_FILE_VERSION, className: this.className, calls: {} }
      : this.load();
  }

  /**
   * @description Reads the snapshot file into a buffer, decompressing it when gzip-compressed.
   *   Scopes the raw bytes so the buffer is garbage-collectable before the (large) jsonl walk.
   */
  private readSnapshotBuffer(): Buffer {
    const raw = readFileSync(this.snapshotPath);
    const gzipped = raw[0] === 0x1f && raw[1] === 0x8b;
    return gzipped ? gunzipSync(raw) : raw;
  }

  private load(): SnapshotFile {
    try {
      if (existsSync(this.snapshotPath)) {
        // Local only (never stored on `this`), so the transient read/decompressed bytes drop after load().
        const buf = this.readSnapshotBuffer();
        if (buf.length > 0 && this.isJsonl(buf)) {
          this.jsonlOnDisk = true;
          this.jsonlHeaderWritten = true;
          return this.loadJsonl(buf);
        }
        const parsed = JSON.parse(buf.toString('utf-8')) as SnapshotFile;
        if (parsed.strings) {
          for (const [ref, value] of Object.entries(parsed.strings)) {
            this.stringPool.set(ref, value);
            this.stringIndex.set(value, ref);
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
    let version = 1;
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
      if (rec && typeof rec === 'object' && '_jsonl' in (rec as object)) {
        if ((rec as Record<string, unknown>)._jsonl === 2) version = 2;
        continue;
      }
      if (rec && typeof rec === 'object' && (rec as { _t?: string })._t === 's') {
        const { ref, val } = rec as { ref: string; val: string };
        if (typeof ref === 'string' && typeof val === 'string') {
          this.stringPool.set(ref, val);
          this.stringIndex.set(val, ref);
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
          // v2 files carry an explicit `refs` field on every call entry; a missing field is
          // normalized to `null` (no model instance). v1 files keep it absent so the legacy
          // reconstruction path in replayStaticCall still applies.
          if (version >= 2 && call.refs === undefined) (call as { refs: unknown }).refs = null;
          parsed.calls[key] = call;
          this.pushSeq(key, call);
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

  /**
   * @description Builds a `SnapshotCall` object, omitting `error` when absent (replay is
   *   tolerant, `assembleCall` callers pass `undefined`); `refs` is passed through as-is
   *   (`record()` always supplies an explicit `null`-or-value so the v2 format always carries
   *   the field, while `get()`/`getAt()` preserve `undefined` for legacy v1 entries).
   */
  private static assembleCall(
    init: { args: SerializedValue[]; result: SerializedValue; error?: SerializedValue },
    refs?: unknown,
  ): SnapshotCall {
    return {
      args: init.args,
      result: init.result,
      ...(init.error !== undefined ? { error: init.error } : {}),
      ...(refs !== undefined ? { refs } : {}),
    };
  }

  public get(callKey: string): SnapshotCall | undefined {
    const call = this.data.calls[callKey];
    if (!call) return undefined;
    return SnapshotStore.assembleCall(
      {
        args: call.args.map((a) => this.depoolValue(a)),
        result: this.depoolValue(call.result),
        error: call.error ? this.depoolValue(call.error) : undefined,
      },
      call.refs,
    );
  }

  private pushSeq(key: string, call: SnapshotCall): void {
    const seq = this.callSeq.get(key);
    if (seq) seq.push(call);
    else this.callSeq.set(key, [call]);
  }

  /**
   * @description Number of recorded occurrences of a call key, in file order.
   */
  public sequenceLength(callKey: string): number {
    return this.callSeq.get(callKey)?.length ?? 0;
  }

  /**
   * @description The `index`-th (0-based) recorded occurrence of a call key, de-pooled.
   */
  public getAt(callKey: string, index: number): SnapshotCall | undefined {
    const call = this.callSeq.get(callKey)?.[index];
    if (!call) return undefined;
    return SnapshotStore.assembleCall(
      {
        args: call.args.map((a) => this.depoolValue(a)),
        result: this.depoolValue(call.result),
        error: call.error ? this.depoolValue(call.error) : undefined,
      },
      call.refs,
    );
  }

  /**
   * @description Sequence-aware replay lookup for unscoped (static) call keys: the k-th replay
   *   call to `callKey` returns the k-th recorded occurrence (file order), generalising the
   *   iterator `next()` sequence behaviour to statics. When the recorded sequence is exhausted,
   *   falls back to the LAST recorded occurrence (warn-once) instead of missing. When a key was
   *   recorded exactly once, this is identical to last-wins.
   *
   *   Returns `undefined` when the key has no recorded occurrences at all.
   */
  public nextStaticReplayEntry(callKey: string): SnapshotCall | undefined {
    const len = this.sequenceLength(callKey);
    if (len === 0) return undefined;
    const k = this.staticReplayCounters.get(callKey) ?? 0;
    this.staticReplayCounters.set(callKey, k + 1);
    if (k < len) return this.getAt(callKey, k);
    if (!this.staticReplayWarned.has(callKey)) {
      this.staticReplayWarned.add(callKey);
      // eslint-disable-next-line no-console
      console.warn(
        `[unimock] ${this.className}: static replay key "${callKey}" called ${k + 1} times but only ${len} occurrence(s) recorded; serving the last occurrence`,
      );
    }
    return this.getAt(callKey, len - 1);
  }

  /**
   * @description Sequence-aware replay lookup for scoped (instance) call keys: same FIFO
   *   semantics as { @link nextStaticReplayEntry }, keyed by the full `call:ref_...:method:`
   *   or getter key. Required for repeated same-argument instance calls whose RESULTS differ
   *   per invocation (e.g. raw `query()` with an incrementing `RETURNING number`), where
   *   last-wins replay would hand every call the final recorded value.
   */
  public nextReplayEntry(callKey: string): SnapshotCall | undefined {
    return this.nextStaticReplayEntry(callKey);
  }

  /**
   * @description Records a call entry (last-wins per callKey, plus ordered history for
   *   sequence-aware replay). No-op outside record mode (defense in depth): the `@Mockable()`
   *   wrappers never call this in replay/off, and the guard also protects direct API calls.
   */
  public record(callKey: string, call: SnapshotCall): void {
    if (!isRecord()) return;
    const pooled = SnapshotStore.assembleCall(
      {
        args: call.args.map((a) => this.poolValue(a)),
        result: this.poolValue(call.result),
        error: call.error ? this.poolValue(call.error) : undefined,
      },
      call.refs ?? null,
    );
    this.data.calls[callKey] = pooled;
    this.pushSeq(callKey, pooled);
    this.pendingKeys.add(callKey);
    this.dirty = true;
  }

  /**
   * @description Persists pending changes to the snapshot file; never writes outside record
   *   mode. The first flush of a record session rewrites the file in full (`writeJsonlFull`,
   *   lazy truncate), subsequent flushes append incrementally.
   */
  public flush(): void {
    if (!isRecord() || !this.dirty) return;
    const dir = dirname(this.snapshotPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    if (!this.jsonlOnDisk) {
      this.writeJsonlFull();
    } else {
      this.appendJsonl();
    }
    this.dirty = false;
  }

  /**
   * @description Frees this store's in-memory snapshot data so it can be garbage-collected
   *   once no references to the store remain. Clears `data.calls` and the string/value pools
   *   and pending indexes (all become GC-eligible). After release the store holds no snapshot
   *   data; if it is requested again via {@link getSnapshotStore} a fresh store is created and
   *   lazily re-loaded from disk.
   *
   *   Call this between host test files to bound memory in a long-running worker (e.g. vitest
   *   `isolate: false`). Make sure the store has been flushed first.
   */
  public release(): void {
    this.resetState({ counters: false, fileState: false });
  }

  /**
   * @description Resets all in-memory snapshot state. `fileState` additionally forgets the
   *   on-disk file (next flush rewrites it in full) and `counters` resets the pooled
   *   string/value counters. Instance config fields (`className`, `snapshotPath`, `symbols`,
   *   `depth`) are left untouched.
   */
  private resetState(opts: { counters: boolean; fileState: boolean }): void {
    this.data = { version: SNAPSHOT_FILE_VERSION, className: this.className, calls: {} };
    this.callSeq.clear();
    this.flushedSeq.clear();
    this.staticReplayCounters.clear();
    this.staticReplayWarned.clear();
    this.stringPool.clear();
    this.stringIndex.clear();
    this.valuePool.clear();
    this.valueIndex.clear();
    this.pendingKeys.clear();
    this.pendingStrings.clear();
    this.pendingValues.clear();
    this.dirty = false;
    if (opts.counters) {
      this.poolCounter = 0;
      this.valueCounter = 0;
    }
    if (opts.fileState) {
      this.jsonlOnDisk = false;
      this.jsonlHeaderWritten = false;
    }
  }

  /**
   * @description Resets all in-memory snapshot state so the next flush rewrites the file in
   *   full (lazy truncate). Invoked by {@link setMode} on the transition to `'record'` so a
   *   new record session starts from a clean slate — no cross-session `_t:'c'` duplicates.
   *
   *   Unlike {@link release}, this also resets `poolCounter`/`valueCounter` and
   *   `jsonlOnDisk`/`jsonlHeaderWritten` (a released store still owns its on-disk file and is
   *   lazily re-loaded).
   */
  private beginFreshRecordSession(): void {
    this.resetState({ counters: true, fileState: true });
  }

  private writeJsonlFull(): void {
    const gz = gzipEnabled();
    const fd = openSync(this.snapshotPath, 'w');
    try {
      this.writeJsonlRecords(
        { gz, fd },
        this.jsonlRecords(),
      );
    } finally {
      closeSync(fd);
    }
    this.jsonlOnDisk = true;
    this.jsonlHeaderWritten = true;
    this.flushedSeq.clear();
    for (const [key, seq] of this.callSeq) this.flushedSeq.set(key, seq.length);
    // Keep calls, stringPool and valuePool resident: replay may run in the same process
    // (record -> flushAllSnapshots -> setMode('replay') -> get) and in-memory entries must
    // still resolve, including pooled strings/values. Only pending markers are cleared.
    this.pendingKeys.clear();
    this.pendingStrings.clear();
    this.pendingValues.clear();
  }

  /**
   * @description Serialised JSONL body of the snapshot file: header, string pool, value pool
   *   and call lines — in that deterministic order.
   */
  private *jsonlRecords(): Generator<string> {
    yield JSON.stringify({ _jsonl: JSONL_FORMAT_VERSION, className: this.className });
    for (const [ref, value] of this.stringPool) yield JSON.stringify({ _t: 's', ref, val: value });
    for (const [ref, value] of this.valuePool) yield JSON.stringify({ _t: 'v', ref, val: value });
    // callSeq, not data.calls: replay consumes occurrences FIFO and loses them across restarts.
    for (const [key, seq] of this.callSeq)
      for (const call of seq) yield JSON.stringify({ _t: 'c', key, call });
  }

  private appendJsonl(): void {
    const gz = gzipEnabled();
    const fd = openSync(this.snapshotPath, 'a');
    try {
      this.writeJsonlRecords(
        { gz, fd },
        this.pendingRecords(),
      );
    } finally {
      closeSync(fd);
    }
    for (const key of this.pendingKeys) this.flushedSeq.set(key, this.callSeq.get(key)?.length ?? 0);
    this.pendingKeys.clear();
    this.pendingStrings.clear();
    this.pendingValues.clear();
  }

  /**
   * @description Pending (not yet flushed) string/value/call records referenced by their
   *   subscription sets.
   */
  private *pendingRecords(): Generator<string> {
    for (const ref of this.pendingStrings) {
      const value = this.stringPool.get(ref);
      if (value !== undefined) yield JSON.stringify({ _t: 's', ref, val: value });
    }
    for (const ref of this.pendingValues) {
      const value = this.valuePool.get(ref);
      if (value !== undefined) yield JSON.stringify({ _t: 'v', ref, val: value });
    }
    // Occurrences, not last-wins: data.calls holds only the final call per key, and
    // replay consumes occurrences FIFO (nextStaticReplayEntry), so every occurrence
    // recorded since the previous flush must reach the file or replay answers mismatch.
    for (const key of this.pendingKeys) {
      const seq = this.callSeq.get(key);
      if (!seq) continue;
      const from = this.flushedSeq.get(key) ?? 0;
      for (let i = from; i < seq.length; i++) yield JSON.stringify({ _t: 'c', key, call: seq[i] });
    }
  }

  /**
   * @description Serialises `records` to the file descriptor, batching 500 lines per `writeSync`
   *   (and per gzip member when compression is enabled) to bound memory and I/O syscalls.
   */
  private writeJsonlRecords(
    target: { gz: boolean; fd: number },
    records: Iterable<string>,
  ): void {
    const { gz, fd } = target;
    const batch: string[] = [];
    const flushBatch = () => {
      if (batch.length === 0) return;
      const content = batch.join('\n') + '\n';
      batch.length = 0;
      const buf = Buffer.from(content, 'utf-8');
      if (gz) writeSync(fd, gzipSync(buf, { level: 9 }));
      else writeSync(fd, buf);
    };
    for (const record of records) {
      batch.push(record);
      if (batch.length >= 500) flushBatch();
    }
    flushBatch();
  }

  private getStringRef(value: string): string {
    const existing = this.stringIndex.get(value);
    if (existing) return existing;
    const ref = `$${this.poolCounter++}`;
    this.stringPool.set(ref, value);
    this.stringIndex.set(value, ref);
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

  private poolVisit(x: SerializedValue): SerializedValue {
    if (valuePoolEnabled() && (x.t === T_ARRAY || x.t === T_OBJECT)) {
      if (this.isLargeValue(x)) return { t: T_POOLED_VALUE, v: this.getValueRef(x) };
    }
    if (x.t === T_STRING && typeof x.v === 'string' && x.v.length > POOL_THRESHOLD) {
      return { t: T_POOLED_STRING, v: this.getStringRef(x.v) };
    }
    return x;
  }

  private poolValue(v: SerializedValue): SerializedValue {
    if (rowPoolEnabled()) {
      return this.poolValueDeep(v);
    }
    return this.visitSerialized(v, (x) => {
      if (compactEnabled() && x.t === T_ARRAY && Array.isArray(x.v)) {
        const table = this.tryCompactTable(x.v, (cell) =>
          this.visitSerialized(cell, (y) => this.poolVisit(y)),
        );
        if (table) return table;
      }
      return this.poolVisit(x);
    });
  }

  private poolValueDeep(v: SerializedValue): SerializedValue {
    let current: SerializedValue = v;
    if (current.t === T_ARRAY && Array.isArray(current.v)) {
      if (compactEnabled()) {
        const table = this.tryCompactTable(current.v, (cell) => this.poolValueDeep(cell));
        if (table) return table;
      }
      current = {
        t: T_ARRAY,
        v: current.v.map((item) => this.poolValueDeep(item as SerializedValue)),
      };
    } else if (current.t === T_OBJECT && Array.isArray(current.v)) {
      current = {
        t: T_OBJECT,
        v: current.v.map((entry) => ({
          k: entry.k,
          v: this.poolValueDeep(entry.v as SerializedValue),
        })),
      };
    }
    if (
      current.t === T_STRING &&
      typeof current.v === 'string' &&
      current.v.length > POOL_THRESHOLD
    ) {
      return { t: T_POOLED_STRING, v: this.getStringRef(current.v) };
    }
    if (valuePoolEnabled() && (current.t === T_ARRAY || current.t === T_OBJECT)) {
      return { t: T_POOLED_VALUE, v: this.getValueRef(current) };
    }
    return current;
  }

  /**
   * @description Encodes a uniform array of objects (>= 50 items, identical key list and
   *   order) as a columnar {@link SerializedCompactTable}. Returns `undefined` when the
   *   shape does not qualify, leaving the array untouched.
   */
  private tryCompactTable(
    items: SerializedValue[],
    poolCell: (v: SerializedValue) => SerializedValue,
  ): SerializedValue | undefined {
    if (items.length < 50) return undefined;
    const first = items[0];
    if (first?.t !== T_OBJECT) return undefined;
    const k = first.v.map((entry) => entry.k);
    const rows: SerializedValue[][] = [];
    for (const item of items) {
      if (item?.t !== T_OBJECT) return undefined;
      if (item.v.length !== k.length) return undefined;
      for (let i = 0; i < k.length; i++) {
        if (item.v[i]?.k !== k[i]) return undefined;
      }
      rows.push(item.v.map((entry) => poolCell(entry.v)));
    }
    return { t: T_COMPACT_TABLE, v: { k, r: rows } };
  }

  /**
   * @description Decides whether a serialized subtree should be pooled as a `_t:'v'` blob.
   *   Counts the nested nodes cheaply first: subtrees within `valuePoolCountLimit()` nodes are
   *   never pooled (no stringify cost). Larger subtrees are pooled only when the serialised
   *   size exceeds {@link valuePoolThreshold} (`UNIMOCK_VALUE_POOL_THRESHOLD`, default 100 KB),
   *   so node count guards the stringify cost while the byte threshold guards disk space.
   */
  private isLargeValue(v: SerializedValue): boolean {
    let count = 0;
    const stack: SerializedValue[] = [v];
    while (stack.length) {
      const cur = stack.pop()!;
      count++;
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
      if (x.t === T_COMPACT_TABLE) {
        const { k, r } = x.v;
        return {
          t: T_ARRAY,
          v: r.map((row) => ({
            t: T_OBJECT,
            v: k.map((key, i) => ({ k: key, v: row[i] })),
          })),
        };
      }
      return x;
    });
  }
}

/**
 * @description Lazily yields a buffer's lines one at a time, so the caller never holds the whole
 *   line array (a large transient allocation on multi-hundred-MB snapshots).
 *   Uses `subarray(pos).indexOf(0x0a)` so the searched offset stays relative to a small view —
 *   `Buffer.indexOf` on absolute offsets wraps into a negative int32 at locations >= 2^31,
 *   which would be misinterpreted as "not found" and collapse the tail into a single line.
 */
function* splitLines(buf: Buffer): Generator<string> {
  let pos = 0;
  while (pos < buf.length) {
    const relEnd = buf.subarray(pos).indexOf(0x0a);
    let end: number;
    if (relEnd < 0) end = buf.length;
    else end = pos + relEnd;
    if (end > pos) {
      yield buf.subarray(pos, end).toString('utf-8');
    }
    pos = end + 1;
  }
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
 * @description Releases the snapshot store(s) for a given class name, freeing their in-memory
 *   call/string/value pools so they can be garbage-collected. The released store(s) are also
 *   removed from the global registry; if needed again they are re-created and lazily re-loaded
 *   from disk on the next {@link getSnapshotStore}. No-op when `className` is absent or no store
 *   exists for it.
 *
 *   Call this between host test files to bound memory in a long-running worker (e.g. vitest
 *   `isolate: false`). Make sure data has been flushed first.
 *
 * @param className - name of the mocked class to release
 */
export function releaseSnapshotStore(className?: string): void {
  if (className === undefined) return;
  for (const [key, store] of stores) {
    if (store.className === className) {
      store.release();
      stores.delete(key);
    }
  }
}

/**
 * @description Releases every cached snapshot store, freeing all in-memory call/string/value
 *   pools and clearing the global registry. Any released store is re-created and lazily
 *   re-loaded from disk on the next {@link getSnapshotStore} for its class.
 *
 *   Call this between host test files to bound memory in a long-running worker (e.g. vitest
 *   `isolate: false`). Make sure data has been flushed first.
 */
export function resetSnapshotStores(): void {
  for (const store of stores.values()) store.release();
  stores.clear();
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
