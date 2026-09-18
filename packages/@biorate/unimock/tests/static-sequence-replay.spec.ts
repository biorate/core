import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../src';

// Regression tests for sequence-aware static-call replay.
//
// Unscoped (static) call keys were replayed last-wins: the N-th replay call to the
// same static key returned the LAST recorded occurrence, not the N-th. The production
// e2e boot wiped out because the FIRST ShopsModel.findAll (boot) got the LAST recorded
// occurrence's refIds (a late spec file's), so every downstream call:{refId}: lookup missed.
//
// nextStaticReplayEntry generalises the iterator next() sequence behaviour to statics:
// the k-th replay call to a static key returns the k-th recorded occurrence (file order),
// falling back to the last occurrence (warn-once) once exhausted. When a key was recorded
// exactly once this is identical to last-wins, so single-occurrence statics are unaffected.

const tmpDirs: string[] = [];
const mkSnapshotDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'unimock-static-seq-'));
  tmpDirs.push(dir);
  return dir;
};

const toEntity = <T extends { toJSON(): Record<string, unknown> }>(
  items: T[] | null | undefined,
): Record<string, unknown>[] =>
  (items ?? []).filter(Boolean).map((item) => item.toJSON());

afterAll(() => {
  SnapshotStore.setMode('off');
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true });
});

class RowSeqBase {
  public dataValues: Record<string, unknown>;
  constructor(values: Record<string, unknown>) {
    this.dataValues = { ...values };
  }
  public toJSON(): Record<string, unknown> {
    return { ...this.dataValues };
  }
  public get(key: string): unknown {
    return this.dataValues[key];
  }
  public static build(values: Record<string, unknown>): RowSeqBase {
    return new this(values);
  }
}

describe('sequence-aware static replay', () => {
  it('first replay static call returns the FIRST recorded occurrence, not the last', () => {
    const dir = mkSnapshotDir();
    let n = 0;
    class RowFirst extends RowSeqBase {
      public static findAll(): RowSeqBase[] {
        const i = n++;
        return [this.build({ i })];
      }
    }
    @Mockable({ snapshotDir: dir, statics: [['build', 'findAll']] })
    class MockedFirst extends RowFirst {}

    const prevMode = SnapshotStore.mode;
    try {
      SnapshotStore.setMode('record');
      expect(toEntity(MockedFirst.findAll())).toEqual([{ i: 0 }]);
      expect(toEntity(MockedFirst.findAll())).toEqual([{ i: 1 }]);
      flushAllSnapshots();

      // Under last-wins both replay calls return { i: 1 }. The first (boot) call
      // MUST return the first recorded occurrence { i: 0 }.
      SnapshotStore.setMode('replay');
      expect(toEntity(MockedFirst.findAll())).toEqual([{ i: 0 }]);
      expect(toEntity(MockedFirst.findAll())).toEqual([{ i: 1 }]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('static replay sequence is driven only by static calls, independent of interleaved instance calls', () => {
    const dir = mkSnapshotDir();
    let n = 0;
    class RowMix extends RowSeqBase {
      public static findAll(): RowSeqBase[] {
        const i = n++;
        return [this.build({ i })];
      }
    }
    @Mockable({ snapshotDir: dir, statics: [['build', 'findAll']] })
    class MockedMix extends RowMix {}

    const prevMode = SnapshotStore.mode;
    try {
      SnapshotStore.setMode('record');
      const a = MockedMix.findAll();
      expect(toEntity(a)).toEqual([{ i: 0 }]);
      expect(a[0].get('i')).toBe(0); // instance-scoped call, recorded under ref 1
      const b = MockedMix.findAll();
      expect(toEntity(b)).toEqual([{ i: 1 }]);
      expect(b[0].get('i')).toBe(1); // instance-scoped call, recorded under ref 2
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const ra = MockedMix.findAll();
      expect(toEntity(ra)).toEqual([{ i: 0 }]);
      // An instance-scoped get() in between must not advance the static counter.
      expect(ra[0].get('i')).toBe(0);
      const rb = MockedMix.findAll();
      expect(toEntity(rb)).toEqual([{ i: 1 }]);
      expect(rb[0].get('i')).toBe(1);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('replays the same static key 3x different results in order, then falls back to last (no miss)', () => {
    const dir = mkSnapshotDir();
    let n = 0;
    class RowThree extends RowSeqBase {
      public static findAll(): RowSeqBase[] {
        const i = n++;
        return [this.build({ i })];
      }
    }
    @Mockable({ snapshotDir: dir, statics: [['build', 'findAll']] })
    class MockedThree extends RowThree {}

    const prevMode = SnapshotStore.mode;
    try {
      SnapshotStore.setMode('record');
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 0 }]);
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 1 }]);
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 2 }]);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 0 }]);
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 1 }]);
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 2 }]);
      // Exhausted: 4th call serves the last recorded occurrence (no UnimockReplayMissError).
      expect(toEntity(MockedThree.findAll())).toEqual([{ i: 2 }]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});
