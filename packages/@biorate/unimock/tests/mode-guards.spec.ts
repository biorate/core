import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { MODE_OFF, MODE_RECORD, MODE_REPLAY, SnapshotStore, serialize } from '../src';
import type { SnapshotCall, UnimockMode } from '../src';

/**
 * Mode-gate contract: outside `'record'` mode `SnapshotStore.record()` and
 * `SnapshotStore.flush()` are no-ops — snapshot files are never created and
 * never modified (byte-for-byte), and nothing is recorded in memory.
 *
 * Every test swaps the global mode and restores the previous one in
 * `finally`, so the suite is independent of the `UNIMOCK` env value.
 *
 * The white-box `dirty`/`pendingKeys` phases pin the `flush()` mode gate in
 * isolation: with the `record()` gate in place a store can only become dirty
 * during a record phase, so the `flush()` guard is exercised by simulating a
 * dirty store directly (defense in depth for any future dirty producer).
 */

const tmpDir = mkdtempSync(join(tmpdir(), 'unimock-mode-guards-'));

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

describe('mode gates: record()/flush() are no-ops outside record mode', () => {
  it('replay: record()+flush() never create a snapshot file', () => {
    withMode(MODE_REPLAY, () => {
      const store = new SnapshotStore('GuardReplay', tmpDir);
      store.record('k', makeCall());
      store.flush();

      expect(existsSync(store.snapshotPath)).toBe(false);
      // record gate: nothing is recorded in memory either
      expect(store.has('k')).toBe(false);
      expect(store.get('k')).toBeUndefined();
      // flush gate (defense in depth): even a dirty store must not be written
      (store as any).dirty = true;
      store.flush();
      expect(existsSync(store.snapshotPath)).toBe(false);
    });
  });

  it('off: record()+flush() never create a snapshot file', () => {
    withMode(MODE_OFF, () => {
      const store = new SnapshotStore('GuardOff', tmpDir);
      store.record('k', makeCall());
      store.flush();

      expect(existsSync(store.snapshotPath)).toBe(false);
      expect(store.has('k')).toBe(false);
      expect(store.get('k')).toBeUndefined();
      (store as any).dirty = true;
      store.flush();
      expect(existsSync(store.snapshotPath)).toBe(false);
    });
  });

  it('replay: never modifies an existing snapshot file (byte-for-byte)', () => {
    let path = '';
    withMode(MODE_RECORD, () => {
      const store = new SnapshotStore('GuardExisting', tmpDir);
      store.record('k', makeCall());
      store.flush();
      expect(existsSync(store.snapshotPath)).toBe(true);
      path = store.snapshotPath;
    });
    const bytesBefore = readFileSync(path);

    withMode(MODE_REPLAY, () => {
      const store = new SnapshotStore('GuardExisting', tmpDir);
      store.record('k2', makeCall());
      store.flush();
      expect(readFileSync(path)).toEqual(bytesBefore);
      // record gate: no in-memory recording in replay
      expect(store.has('k2')).toBe(false);
      expect(store.get('k2')).toBeUndefined();
      // flush gate (defense in depth): a dirty store with a pending key must
      // not append to the existing file
      (store as any).dirty = true;
      (store as any).pendingKeys.add('k');
      store.flush();
      expect(readFileSync(path)).toEqual(bytesBefore);
    });
  });

  it('record: record()+flush() creates the file and the call is retrievable', () => {
    withMode(MODE_RECORD, () => {
      const store = new SnapshotStore('GuardHappy', tmpDir);
      store.record('k', makeCall());
      store.flush();

      expect(existsSync(store.snapshotPath)).toBe(true);
      expect(store.has('k')).toBe(true);
      expect(store.get('k')!.result).toEqual(serialize({ rows: [[1]] }));
    });
  });
});
