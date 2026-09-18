import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { afterAll, describe, expect, it } from 'vitest';
import {
  MODE_RECORD,
  MODE_REPLAY,
  SnapshotStore,
  getSnapshotStore,
  serialize,
} from '../src';
import type { SnapshotCall, UnimockMode } from '../src';

/**
 * Record-session contract: a record run is a clean slate.
 *
 * - A store created in `'record'` mode ignores an existing snapshot file (the first flush
 *   rewrites the file in full).
 * - Entering `'record'` mode from replay/off resets all cached stores in memory, so a new
 *   record run produces a file containing only its own calls (no cross-run `_t:'c'`
 *   duplicates).
 * - A repeated `setMode('record')` inside the same record session clears nothing.
 * - The in-process record → flush → replay pattern still resolves entries from memory.
 *
 * Every test swaps the global mode and restores the previous one in `finally`, so the suite
 * is independent of the `UNIMOCK` env value.
 */

const tmpDir = mkdtempSync(join(tmpdir(), 'unimock-record-session-'));

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

/** Runs `fn` under `mode`, always restoring the previous global mode. */
const withMode = (mode: UnimockMode, fn: () => void): void => {
  const prev = SnapshotStore.mode;
  SnapshotStore.setMode(mode);
  try {
    fn();
  } finally {
    SnapshotStore.setMode(prev);
  }
};

const makeCall = (): SnapshotCall => ({
  args: [serialize('SELECT 1')],
  result: serialize({ rows: [[1]] }),
});

/** Collects `_t:'c'` call keys from a JSONL snapshot file (gzip transparently). */
const readCallKeys = (path: string): string[] => {
  let raw = readFileSync(path);
  if (raw[0] === 0x1f && raw[1] === 0x8b) raw = gunzipSync(raw);
  const keys: string[] = [];
  for (const line of raw.toString('utf-8').split('\n')) {
    if (!line) continue;
    try {
      const rec = JSON.parse(line) as { _t?: string; key?: string };
      if (rec._t === 'c' && typeof rec.key === 'string') keys.push(rec.key);
    } catch {
      // non-JSON line — skip
    }
  }
  return keys;
};

describe('record session = clean slate', () => {
  it('session #1: record+flush writes the file with the session calls', () => {
    withMode(MODE_RECORD, () => {
      const store = new SnapshotStore('SessFirst', tmpDir);
      store.record('callA', makeCall());
      store.flush();

      expect(existsSync(store.snapshotPath)).toBe(true);
      expect(readCallKeys(store.snapshotPath)).toContain('callA');
    });
  });

  it('a new record run after replay keeps only its own calls in the file (no cross-run duplicates)', () => {
    const prev = SnapshotStore.mode;
    try {
      // Run #1 (record)
      SnapshotStore.setMode(MODE_RECORD);
      const store = getSnapshotStore('SessRerun', tmpDir);
      store.record('callA', makeCall());
      store.flush();
      expect(readCallKeys(store.snapshotPath)).toContain('callA');

      // Interim replay run, then a fresh record run (setMode transition triggers the sweep)
      SnapshotStore.setMode(MODE_REPLAY);
      SnapshotStore.setMode(MODE_RECORD);

      const rerun = getSnapshotStore('SessRerun', tmpDir);
      rerun.record('callB', makeCall());
      rerun.flush();

      const keys = readCallKeys(rerun.snapshotPath);
      expect(keys).toContain('callB');
      expect(keys).not.toContain('callA');
    } finally {
      SnapshotStore.setMode(prev);
    }
  });

  it('repeated setMode(record) inside a record session does not clear recorded calls', () => {
    withMode(MODE_RECORD, () => {
      const store = new SnapshotStore('SessRepeat', tmpDir);
      store.record('key1', makeCall());

      SnapshotStore.setMode(MODE_RECORD);

      expect(store.has('key1')).toBe(true);
      expect(store.get('key1')).toBeDefined();
    });
  });

  it('record → flush → replay: get() resolves the entry from memory (in-process pattern)', () => {
    const prev = SnapshotStore.mode;
    try {
      SnapshotStore.setMode(MODE_RECORD);
      const store = new SnapshotStore('SessMemory', tmpDir);
      store.record('k', makeCall());
      store.flush();

      SnapshotStore.setMode(MODE_REPLAY);

      expect(store.get('k')).toBeDefined();
      expect(store.get('k')!.result).toEqual(serialize({ rows: [[1]] }));
    } finally {
      SnapshotStore.setMode(prev);
    }
  });

  it('constructor in record mode starts fresh over an existing file', () => {
    withMode(MODE_RECORD, () => {
      const first = new SnapshotStore('SessFreshFile', tmpDir);
      first.record('oldKey', makeCall());
      first.flush();
      expect(existsSync(first.snapshotPath)).toBe(true);

      const second = new SnapshotStore('SessFreshFile', tmpDir);
      expect(second.has('oldKey')).toBe(false);
      expect(second.get('oldKey')).toBeUndefined();
    });
  });
});
