import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import {
  MODE_OFF,
  MODE_RECORD,
  SnapshotStore,
  Unimock,
  getSnapshotStore,
  releaseSnapshotStore,
  resetSnapshotStores,
  serialize,
} from '../src';
import type { SnapshotCall, UnimockMode } from '../src';

/**
 * Lifecycle tests for the snapshot-store release/reset API:
 *  - `release()` frees in-memory state (calls, pools, pending buffers, dirty flag);
 *  - `releaseSnapshotStore(className)` / `resetSnapshotStores()` drop stores from
 *    the global registry (observable via identity: next `getSnapshotStore` re-creates);
 *  - released stores re-load from disk, so replay still resolves;
 *  - the lazy `splitLines` loader round-trips pooled (string/value) snapshots.
 *
 * Snapshot files live in per-test `os.tmpdir()` directories, removed in `afterAll`.
 */

const tmpDirs: string[] = [];
const classNames: string[] = [];

const mkSnapshotDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'unimock-release-'));
  tmpDirs.push(dir);
  return dir;
};

const trackClass = (className: string): string => {
  classNames.push(className);
  return className;
};

/** Temporarily swaps env values (`undefined` deletes) and restores them afterwards. */
const withEnv = (values: Record<string, string | undefined>, fn: () => void): void => {
  const saved: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(values)) {
    saved[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

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

const SMALL_POOL_LIMITS = {
  UNIMOCK_VALUE_POOL_COUNT_LIMIT: '5',
  UNIMOCK_VALUE_POOL_THRESHOLD: '10',
} as const;

/** A serialized subtree big enough to hit the value pool under small limits. */
const largeValue = (): Record<string, number> => {
  const out: Record<string, number> = {};
  for (let i = 0; i < 3000; i++) out[`key${i}`] = i;
  return out;
};

afterAll(() => {
  for (const className of classNames) releaseSnapshotStore(className);
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true });
});

describe('SnapshotStore.release()', () => {
  it('clears data.calls, string/value pools, pending buffers and dirty flag', () => {
    withEnv(SMALL_POOL_LIMITS, () => {
      const store = new SnapshotStore(trackClass('ReleaseSvc'), mkSnapshotDir());
      withMode(MODE_RECORD, () => {
        store.record('a:1', {
          args: [serialize('x'.repeat(600))],
          result: serialize({ ok: 1 }),
        });
        store.record('a:2', {
          args: [serialize({ alpha: [1, 2, 3, 4, 5] })],
          result: serialize('done'),
        });

        expect(store.has('a:1')).toBe(true);
        expect((store as any).stringPool.size).toBeGreaterThan(0);
        expect((store as any).valuePool.size).toBeGreaterThan(0);
        expect((store as any).valueIndex.size).toBeGreaterThan(0);
        expect((store as any).pendingKeys.size).toBeGreaterThan(0);
        expect((store as any).pendingStrings.size).toBeGreaterThan(0);
        expect((store as any).pendingValues.size).toBeGreaterThan(0);
        expect((store as any).dirty).toBe(true);
      });

      store.release();

      expect(Object.keys((store as any).data.calls)).toHaveLength(0);
      expect((store as any).stringPool.size).toBe(0);
      expect((store as any).valuePool.size).toBe(0);
      expect((store as any).valueIndex.size).toBe(0);
      expect((store as any).pendingKeys.size).toBe(0);
      expect((store as any).pendingStrings.size).toBe(0);
      expect((store as any).pendingValues.size).toBe(0);
      expect((store as any).dirty).toBe(false);
      expect(store.has('a:1')).toBe(false);
      expect(store.has('a:2')).toBe(false);
      expect(store.get('a:1')).toBeUndefined();
      expect(store.get('a:2')).toBeUndefined();
    });
  });
});

describe('releaseSnapshotStore(className)', () => {
  it('releases + deletes only matching-className stores across multiple dirs', () => {
    const dirA = mkSnapshotDir();
    const dirB = mkSnapshotDir();
    const a1 = getSnapshotStore(trackClass('ScopedSvc'), dirA);
    const a2 = getSnapshotStore('ScopedSvc', dirB);
    const other = getSnapshotStore(trackClass('OtherSvc'), dirA);

    withMode(MODE_RECORD, () => {
      a1.record('k', {
        args: [serialize('SELECT 1')],
        result: serialize({ rows: [1] }),
      });
      a1.flush();
    });

    releaseSnapshotStore('ScopedSvc');

    withMode(MODE_OFF, () => {
      const a1b = getSnapshotStore('ScopedSvc', dirA);
      const a2b = getSnapshotStore('ScopedSvc', dirB);
      expect(a1b).not.toBe(a1);
      expect(a2b).not.toBe(a2);
      expect(a1b.snapshotPath).toBe(a1.snapshotPath);
      expect(a1b.has('k')).toBe(true);
      expect(a1b.get('k')).toEqual({
        args: [serialize('SELECT 1')],
        result: serialize({ rows: [1] }),
        refs: null,
      });
      expect(getSnapshotStore('OtherSvc', dirA)).toBe(other);
    });
  });

  it('is a no-op for undefined or unknown className', () => {
    const dir = mkSnapshotDir();
    const store = getSnapshotStore(trackClass('NoopSvc'), dir);
    withMode(MODE_RECORD, () => {
      store.record('k', { args: [], result: serialize(1) });
    });

    expect(() => releaseSnapshotStore()).not.toThrow();
    expect(() => releaseSnapshotStore('NeverRegistered')).not.toThrow();

    expect(getSnapshotStore('NoopSvc', dir)).toBe(store);
    expect(store.has('k')).toBe(true);
  });

  it('Unimock.release frees the store via the namespace API', () => {
    const dir = mkSnapshotDir();
    const store = getSnapshotStore(trackClass('AliasSvc'), dir);
    withMode(MODE_RECORD, () => {
      store.record('k', { args: [], result: serialize(1) });
    });

    Unimock.release('AliasSvc');

    expect(store.has('k')).toBe(false);
    const fresh = getSnapshotStore('AliasSvc', dir);
    expect(fresh).not.toBe(store);
  });
});

describe('resetSnapshotStores()', () => {
  it('releases every store and empties the registry', () => {
    const dirA = mkSnapshotDir();
    const dirB = mkSnapshotDir();
    const s1 = getSnapshotStore(trackClass('ResetSvcA'), dirA);
    const s2 = getSnapshotStore(trackClass('ResetSvcB'), dirB);
    withMode(MODE_RECORD, () => {
      s1.record('k', { args: [serialize('q')], result: serialize(42) });
      s1.flush();
      s2.record('k2', { args: [], result: serialize(7) });
    });

    resetSnapshotStores();

    withMode(MODE_OFF, () => {
      const s1b = getSnapshotStore('ResetSvcA', dirA);
      const s2b = getSnapshotStore('ResetSvcB', dirB);
      expect(s1b).not.toBe(s1);
      expect(s2b).not.toBe(s2);
      expect(s1b.has('k')).toBe(true);
      expect(s1b.get('k')).toEqual({
        args: [serialize('q')],
        result: serialize(42),
        refs: null,
      });
      expect(s2b.has('k2')).toBe(false);
    });
  });
});

describe('re-load after release', () => {
  it('getSnapshotStore re-creates a fresh store that re-loads from disk', () => {
    const dir = mkSnapshotDir();
    const store = getSnapshotStore(trackClass('ReloadSvc'), dir);
    withMode(MODE_RECORD, () => {
      store.record('query:abc', {
        args: [serialize('SELECT 1'), serialize({ page: 2 })],
        result: serialize({ rows: [1, 2, 3], total: 3 }),
      });
      store.flush();
    });
    const before = store.get('query:abc');

    releaseSnapshotStore('ReloadSvc');

    withMode(MODE_OFF, () => {
      const fresh = getSnapshotStore('ReloadSvc', dir);
      expect(fresh).not.toBe(store);
      expect(fresh.snapshotPath).toBe(store.snapshotPath);
      expect(fresh.get('query:abc')).toEqual(before);
    });
  });
});

describe('lazy splitLines round-trip', () => {
  const mixedCalls = (): Record<string, SnapshotCall> => {
    const longA = 'A'.repeat(600);
    const longB = 'B'.repeat(700);
    const mixed = [{ name: longA, nested: { deep: [1, 'two', null] } }, longB];
    return {
      'q:1': {
        args: [serialize('small'), serialize(longA)],
        result: serialize({ ok: true }),
        refs: null,
      },
      'q:2': { args: [serialize(mixed)], result: serialize(largeValue()), refs: null },
      'q:3': { args: [], result: serialize([1, 2, 3]), refs: null },
    };
  };

  const roundTrip = (gzip: boolean): void => {
    const dir = mkSnapshotDir();
    const className = trackClass(`RoundTrip${gzip ? 'Gz' : 'Plain'}`);
    const recorded = mixedCalls();
    withEnv({ ...SMALL_POOL_LIMITS, UNIMOCK_GZIP: gzip ? '1' : undefined }, () => {
      const store = new SnapshotStore(className, dir);
      withMode(MODE_RECORD, () => {
        for (const [key, call] of Object.entries(recorded)) {
          store.record(key, call);
        }
        expect((store as any).stringPool.size).toBeGreaterThan(0);
        expect((store as any).valuePool.size).toBeGreaterThan(0);
        store.flush();
        const raw = readFileSync(store.snapshotPath);
        if (gzip) {
          expect(raw[0]).toBe(0x1f);
          expect(raw[1]).toBe(0x8b);
        } else {
          expect(raw.toString('utf-8', 0, 1)).toBe('{');
        }
      });
    });
    // Load with default env: gzip is auto-detected from the magic bytes and
    // de-pooling does not consult env.
    withMode(MODE_OFF, () => {
      const fresh = new SnapshotStore(className, dir);
      for (const [key, call] of Object.entries(recorded)) {
        expect(fresh.get(key)).toEqual(call);
      }
    });
  };

  it('mixed pooled calls survive a plain (non-gzip) flush + reload', () =>
    roundTrip(false));

  it('mixed pooled calls survive a gzip flush + reload', () => roundTrip(true));

  it('flushes >500 pooled strings as batched gzip and reloads identically', () => {
    const dir = mkSnapshotDir();
    const className = trackClass('BatchSvc');
    const args = Array.from(
      { length: 1200 },
      (_, i) => `row-${i}-${'payload'.repeat(80)}`,
    );
    const call: SnapshotCall = {
      args: args.map((a) => serialize(a)),
      result: serialize('ok'),
      refs: null,
    };
    withEnv({ UNIMOCK_GZIP: '1' }, () => {
      const store = new SnapshotStore(className, dir);
      withMode(MODE_RECORD, () => {
        store.record('batch:1', call);
        // 1200 unique >500-char strings, each individually string-pooled; the
        // args array itself (1201 nodes) stays under default value-pool limits.
        expect((store as any).stringPool.size).toBe(1200);
        expect((store as any).valuePool.size).toBe(0);
        store.flush();
        const raw = readFileSync(store.snapshotPath);
        expect(raw[0]).toBe(0x1f);
        expect(raw[1]).toBe(0x8b);
      });
    });
    withMode(MODE_OFF, () => {
      const fresh = new SnapshotStore(className, dir);
      const got = fresh.get('batch:1');
      expect(got).toEqual(call);
      expect(got!.args).toHaveLength(1200);
      expect(got!.args.every((a) => a.t === 'string')).toBe(true);
    });
  });
});
