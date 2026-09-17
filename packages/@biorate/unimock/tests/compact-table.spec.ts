import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { SnapshotStore, releaseSnapshotStore, serialize } from '../src';
import type { SnapshotCall } from '../src';

/**
 * Opt-in compact-table encoding (`UNIMOCK_COMPACT`): a uniform array of objects
 * (>= 50 items, identical key list) is stored columnar as `compact_table` and
 * transposed back to the original array on depool — unconditionally, without
 * consulting env at replay time. Without the flag, output is unchanged.
 *
 * Snapshot files live in per-test `os.tmpdir()` directories, removed in `afterAll`.
 */

const tmpDirs: string[] = [];
const classNames: string[] = [];

const mkSnapshotDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'unimock-compact-'));
  tmpDirs.push(dir);
  return dir;
};

const trackClass = (className: string): string => {
  classNames.push(className);
  return className;
};

/** Temporarily swaps env values (`undefined` deletes) and restores them afterwards. */
const withEnv = (
  values: Record<string, string | undefined>,
  fn: () => void,
): void => {
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

const COMPACT_FLAGS = {
  UNIMOCK_COMPACT: '1',
  UNIMOCK_ROW_POOL: '1',
} as const;

const uniformRows = (count: number): { id: number; name: string; score: number }[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `row-${i}`,
    score: i * 1.5,
  }));

const compactCall = (): SnapshotCall => ({
  args: [serialize({ page: 1 })],
  result: serialize({ rows: uniformRows(200) }),
});

const readCallLines = (snapshotPath: string): string[] =>
  readFileSync(snapshotPath, 'utf-8')
    .split('\n')
    .filter((line) => line.includes('"_t":"c"'));

afterAll(() => {
  for (const className of classNames) releaseSnapshotStore(className);
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true });
});

describe('compact_table encoding (UNIMOCK_COMPACT)', () => {
  it('stores a uniform 200-row array as compact_table when enabled', () => {
    const dir = mkSnapshotDir();
    const className = trackClass('CompactTableSvc');
    const call = compactCall();
    let snapshotPath = '';

    withEnv(COMPACT_FLAGS, () => {
      const store = new SnapshotStore(className, dir);
      store.record('rows:1', call);
      store.flush();
      snapshotPath = store.snapshotPath;
    });

    const raw = readFileSync(snapshotPath, 'utf-8');
    const tableLines = raw.split('\n').filter((l) => l.includes('"compact_table"'));
    expect(tableLines.length).toBeGreaterThan(0);
    expect(tableLines[0]).toContain('"k":["id","name","score"]');
    expect(tableLines[0]).toContain('"r":[');
  });

  it('depools compact_table back to the original array without any env flag', () => {
    const dir = mkSnapshotDir();
    const className = trackClass('CompactTableReplaySvc');
    const call = compactCall();

    withEnv(COMPACT_FLAGS, () => {
      const store = new SnapshotStore(className, dir);
      store.record('rows:1', call);
      store.flush();
    });

    releaseSnapshotStore(className);

    withEnv({ UNIMOCK_COMPACT: undefined, UNIMOCK_ROW_POOL: undefined }, () => {
      const fresh = new SnapshotStore(className, dir);
      const got = fresh.get('rows:1');
      expect(got).toEqual(call);
      const result = got!.result as { t: string; v: { k: string; v: unknown }[] };
      expect(result.t).toBe('object');
      const rowsNode = result.v.find((e) => e.k === 'rows')!.v as {
        t: string;
        v: { t: string; v: { k: string; v: unknown }[] }[];
      };
      expect(rowsNode.t).toBe('array');
      const rows = rowsNode.v;
      expect(rows).toHaveLength(200);
      expect(rows[0]).toEqual(serialize({ id: 0, name: 'row-0', score: 0 }));
      expect(rows[199]).toEqual(serialize({ id: 199, name: 'row-199', score: 298.5 }));
    });
  });

  it('does not emit compact_table with default env', () => {
    const dir = mkSnapshotDir();
    const className = trackClass('CompactDefaultSvc');
    const call = compactCall();
    let snapshotPath = '';

    withEnv({ UNIMOCK_COMPACT: undefined, UNIMOCK_ROW_POOL: undefined }, () => {
      const store = new SnapshotStore(className, dir);
      store.record('rows:1', call);
      store.flush();
      snapshotPath = store.snapshotPath;
    });

    const callLines = readCallLines(snapshotPath).filter((l) =>
      l.includes('"key":"rows:1"'),
    );
    expect(callLines).toHaveLength(1);
    expect(callLines[0]).not.toContain('compact_table');
    expect(callLines[0]).toContain('"array"');
  });
});
