import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../../src';
import { PREFIX_REF } from '../../src/constants';
import { nextRefId } from '../../src/utils';

/**
 * Regression: ref ids must be a pure function of (class, ordinal within class),
 * NOT of a single global creation counter. The production e2e wiped out on replay
 * because the record process and the replay process wrap the same logical model
 * instances at different positions of a shared global counter (the replay boot's
 * extra `new Sequelize()` + mocked connector wrap many other objects first), so
 * every `call:{refId}:...` key shifted and missed.
 *
 * Per-class counters isolate each class's ordinal, so cross-class interleaving
 * can no longer shift a class's ref ids.
 */

const SNAPSHOT_DIR = mkdtempSync(join(tmpdir(), 'unimock-refid-det-'));

const ordinal = (refId: string): number =>
  Number(refId.slice(refId.lastIndexOf('_') + 1));

afterAll(() => {
  rmSync(SNAPSHOT_DIR, { recursive: true, force: true });
});

describe('nextRefId: per-class determinism', () => {
  it('isolates each class ordinal from cross-class interleaving', () => {
    // Interleave two distinct classes: A, B, A, B.
    // Under a GLOBAL counter the ordinals would be 1,2,3,4 (b1 takes an ordinal
    // between a1 and a2). Under PER-CLASS counters each class keeps its own
    // 1,2 sequence — that is the discriminating property of the fix.
    const a1 = nextRefId(PREFIX_REF, 'ZRefIdDetA');
    const b1 = nextRefId(PREFIX_REF, 'ZRefIdDetB');
    const a2 = nextRefId(PREFIX_REF, 'ZRefIdDetA');
    const b2 = nextRefId(PREFIX_REF, 'ZRefIdDetB');

    // Each class starts at its own ordinal 1, regardless of the interleaving.
    expect(ordinal(a1)).toBe(1);
    expect(ordinal(b1)).toBe(1);
    // Each class increments independently of the other.
    expect(ordinal(a2)).toBe(2);
    expect(ordinal(b2)).toBe(2);
    // Distinct classes never collapse onto one shared sequence.
    expect(a1).not.toBe(b1);
    expect(a2).not.toBe(b2);
  });

  it('emits the ref_<ClassName>_<ordinal> shape', () => {
    expect(nextRefId(PREFIX_REF, 'ZRefIdFmt')).toMatch(/^ref_ZRefIdFmt_\d+$/);
  });
});

describe('refId scoping across cross-class interleaving (record/replay)', () => {
  class RowA {
    public dataValues: Record<string, unknown>;
    constructor(values: Record<string, unknown>) {
      this.dataValues = { ...values };
    }
    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }
    public static build(values: Record<string, unknown>): RowA {
      return new this(values);
    }
    public static findAll(): RowA[] {
      return [this.build({ id: 1, v: 'a1' }), this.build({ id: 2, v: 'a2' })];
    }
  }

  class RowB {
    public dataValues: Record<string, unknown>;
    constructor(values: Record<string, unknown>) {
      this.dataValues = { ...values };
    }
    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }
    public static build(values: Record<string, unknown>): RowB {
      return new this(values);
    }
    public static findAll(): RowB[] {
      return [this.build({ id: 11, v: 'b1' }), this.build({ id: 12, v: 'b2' })];
    }
  }

  const toEntity = <T extends { toJSON(): Record<string, unknown> }>(
    items: T[] | null | undefined,
  ): Record<string, unknown>[] =>
    (items ?? []).filter(Boolean).map((item) => item.toJSON());

  it('record-order-A replays under registration-order-B', () => {
    const prevMode = SnapshotStore.mode;
    try {
      @Mockable({ snapshotDir: SNAPSHOT_DIR, statics: [['build', 'findAll']] })
      class MockedA extends RowA {}

      @Mockable({ snapshotDir: SNAPSHOT_DIR, statics: [['build', 'findAll']] })
      class MockedB extends RowB {}

      // RECORD: wrap class A first, then class B.
      SnapshotStore.setMode('record');
      expect(toEntity(MockedA.findAll())).toEqual([
        { id: 1, v: 'a1' },
        { id: 2, v: 'a2' },
      ]);
      expect(toEntity(MockedB.findAll())).toEqual([
        { id: 11, v: 'b1' },
        { id: 12, v: 'b2' },
      ]);
      flushAllSnapshots();

      // REPLAY: reversed cross-class order (B first, then A). Per-row toJSON is
      // a per-instance scoped call — it must replay each row's own data, with no
      // UnimockReplayMissError and no cross-class row bleed.
      SnapshotStore.setMode('replay');
      expect(toEntity(MockedB.findAll())).toEqual([
        { id: 11, v: 'b1' },
        { id: 12, v: 'b2' },
      ]);
      expect(toEntity(MockedA.findAll())).toEqual([
        { id: 1, v: 'a1' },
        { id: 2, v: 'a2' },
      ]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});
