import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import {
  MODE_RECORD,
  MODE_REPLAY,
  MockHandler,
  Mockable,
  SnapshotStore,
  UnimockReplayMissError,
  flushAllSnapshots,
  getSnapshotStore,
  makeCallKey,
  releaseSnapshotStore,
  serialize,
  deserialize,
} from '../../src';
import type { UnimockMode } from '../../src';

// Regression tests for the record→replay fidelity gaps found in the production
// e2e flow (transaction proxies passed as call args, repeated same-key instance
// calls, per-flush occurrence persistence):
//
//  1. callKey was computed over RAW args, so a MockHandler proxy argument
//     (e.g. `{ transaction: tx }` in Sequelize static calls) produced DIFFERENT
//     hashes in record (target = live object) vs replay (target = null) even
//     though both carry the same ref id -> UnimockReplayMissError on replay.
//  2. Instance-level callKeys were replayed LAST-WINS (store.get) while statics
//     consumed a FIFO sequence -> repeating instance calls (e.g. `query(SQL)`
//     per transaction) returned the last recorded value for every replay call.
//  3. Repeated same-key occurrences were persisted only last-wins: writeJsonlFull
//     and appendJsonl both emitted `data.calls[key]`, so a fresh replay process
//     (store loaded from disk) saw ONE occurrence per key, not the full sequence.

const tmpDirs: string[] = [];
const classNames: string[] = [];
let classSeq = 0;

const mkSnapshotDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'unimock-fidelity-'));
  tmpDirs.push(dir);
  return dir;
};

const trackClass = (className: string): string => {
  classNames.push(className);
  return className;
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

afterAll(() => {
  for (const className of classNames) releaseSnapshotStore(className);
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true });
});

describe('callKey stability for ref-id proxy arguments', () => {
  it('makeCallKey hashes a ref-id proxy arg independently of its target shape', () => {
    const dir = mkSnapshotDir();
    const store = getSnapshotStore(trackClass(`HashProxySvc${classSeq++}`), dir);
    const recordedProxy = new MockHandler({ live: true }, 'ref_Tx_1', store);
    const rebuiltProxy = new MockHandler(null, 'ref_Tx_1', store);
    const otherProxy = new MockHandler(null, 'ref_Tx_2', store);

    const args = (tx: unknown) => [
      { where: { shop_id: 35, ldap: '60000002' }, session: tx },
    ];

    // Same logical call: same ref id, different internal target -> same key.
    const recordedKey = makeCallKey('', 'findOne', args(recordedProxy));
    expect(recordedKey).toBe(makeCallKey('', 'findOne', args(rebuiltProxy)));
    // Different ref id -> different key (ref id still participates in the hash).
    expect(recordedKey).not.toBe(makeCallKey('', 'findOne', args(otherProxy)));
  });

  it('record then replay of a static call taking a transaction proxy hits (no miss)', async () => {
    const dir = mkSnapshotDir();
    class Tx {
      public async commit(): Promise<void> {}
      public async rollback(): Promise<void> {}
    }
    class Connector {
      public async transaction(): Promise<Tx> {
        return new Tx();
      }
    }
    class AccountRepo {
      public static findOne(options: Record<string, unknown>): null {
        return null;
      }
    }
    @Mockable({ snapshotDir: dir })
    class MockedConnector extends Connector {}
    @Mockable({ snapshotDir: dir, statics: [['findOne']] })
    class MockedAccount extends AccountRepo {}

    const prevMode = SnapshotStore.mode;
    try {
      SnapshotStore.setMode(MODE_RECORD);
      const tx = await new MockedConnector().transaction();
      // Record a static call whose args contain a MockHandler proxy (transaction).
      expect(
        MockedAccount.findOne({ where: { shop_id: 35 }, transaction: tx }),
      ).toBeNull();

      flushAllSnapshots();

      SnapshotStore.setMode(MODE_REPLAY);
      // The replayed transaction() returns a rebuilt MockHandler with the SAME
      // ref id; the static call must hit the recorded occurrence, not miss.
      const replayTx = await new MockedConnector().transaction();
      expect(() =>
        MockedAccount.findOne({
          where: { shop_id: 35 },
          transaction: replayTx,
        }),
      ).not.toThrow();
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('instance-level FIFO replay', () => {
  it('replays N same-key instance calls in recorded order (not last-wins)', () => {
    const dir = mkSnapshotDir();
    class SqlService {
      private n = 0;
      public query(sql: string): { n: number; sql: string } {
        return { n: ++this.n, sql };
      }
    }
    @Mockable({ snapshotDir: dir })
    class MockedSql extends SqlService {}

    const prevMode = SnapshotStore.mode;
    try {
      SnapshotStore.setMode(MODE_RECORD);
      const sql = new MockedSql();
      expect(sql.query('SELECT 1')).toEqual({ n: 1, sql: 'SELECT 1' });
      expect(sql.query('SELECT 1')).toEqual({ n: 2, sql: 'SELECT 1' });
      expect(sql.query('SELECT 1')).toEqual({ n: 3, sql: 'SELECT 1' });
      flushAllSnapshots();

      SnapshotStore.setMode(MODE_REPLAY);
      const replaySql = new MockedSql();
      expect(replaySql.query('SELECT 1')).toEqual({ n: 1, sql: 'SELECT 1' });
      expect(replaySql.query('SELECT 1')).toEqual({ n: 2, sql: 'SELECT 1' });
      expect(replaySql.query('SELECT 1')).toEqual({ n: 3, sql: 'SELECT 1' });
      // Exhausted: serves the last recorded occurrence (no miss), like statics.
      expect(replaySql.query('SELECT 1')).toEqual({ n: 3, sql: 'SELECT 1' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('per-flush occurrence persistence', () => {
  it('fresh store reload sees every occurrence split across writeJsonlFull + appends', () => {
    const dir = mkSnapshotDir();
    const className = trackClass(`FlushReloadSvc${classSeq++}`);
    const key = 'call:ref_Svc_1:query:f1';
    const occurrence = (n: number) => ({
      args: [serialize('SELECT 1')],
      result: serialize({ number: n }),
      refs: null,
    });

    const store = new SnapshotStore(className, dir);
    withMode(MODE_RECORD, () => {
      // First flush goes through writeJsonlFull, subsequent through appendJsonl
      // (flushedSeq delta). All three occurrences must reach the file.
      store.record(key, occurrence(1));
      store.flush();
      store.record(key, occurrence(2));
      store.flush();
      store.record(key, occurrence(3));
      store.flush();
    });

    const raw = readFileSync(store.snapshotPath, 'utf-8');
    expect(raw.split(`"key":"${key}"`).length - 1).toBe(3);

    // Simulate a replay worker: a fresh store instance loaded from disk.
    const fresh = new SnapshotStore(className, dir);
    withMode(MODE_REPLAY, () => {
      expect(fresh.nextReplayEntry(key)?.result).toEqual(serialize({ number: 1 }));
      expect(fresh.nextReplayEntry(key)?.result).toEqual(serialize({ number: 2 }));
      expect(fresh.nextReplayEntry(key)?.result).toEqual(serialize({ number: 3 }));
      // Exhausted: falls back to the last occurrence (no miss).
      expect(fresh.nextReplayEntry(key)?.result).toEqual(serialize({ number: 3 }));
    });
  });
});

describe('replay miss surfaces the primary callKey', () => {  it('UnimockReplayMissError message does not crash on unstringifiable proxy args', () => {
    const dir = mkSnapshotDir();
    const store = getSnapshotStore(trackClass(`ErrMsgSvc${classSeq++}`), dir);
    const proxy = new MockHandler({ live: true }, 'ref_Tx_1', store);
    let error: unknown;
    // Under replay mode the proxy get trap turns `toJSON` into a call lookup;
    // JSON.stringify(args) in the error constructor must not surface that as
    // the primary miss (it must print the real missed callKey instead).
    withMode(MODE_REPLAY, () => {
      try {
        throw new UnimockReplayMissError(
          'findOne:deadbeef',
          'findOne',
          [{ where: { a: 1 }, transaction: proxy }],
        );
      } catch (e) {
        error = e;
      }
    });
    expect(error).toBeInstanceOf(UnimockReplayMissError);
    const message = (error as Error).message;
    expect(message).toContain('findOne:deadbeef');
    expect(message).toContain('findOne');
  });
});

describe('callKey ignores volatile identity values', () => {
  it('same call with different session_id/uuid/transaction_id hashes identically', () => {
    const stable = { shop_id: 35, workstation_id: 0, tx_number: 137, ldap: '60032113', type: 'LOAN' };
    const a = makeCallKey('', 'create', [
      { ...stable, session_id: '60032113:35:0:137:20251110', uuid: 'u-one', transaction_id: 17, last_stamp: '2025-11-10T13:58:43+03:00', creation: '2025-11-10T13:58:43+03:00' },
      { ignoreDuplicates: false },
    ]);
    const b = makeCallKey('', 'create', [
      { ...stable, session_id: '60032113:35:10:17:20251115', uuid: 'u-two', transaction_id: 42, last_stamp: '2025-11-15T18:01:00+03:00', creation: '2025-11-15T18:01:00+03:00' },
      { ignoreDuplicates: false },
    ]);
    expect(a).toBe(b);
    const c = makeCallKey('', 'create', [
      { ...stable, session_id: '60032113:35:0:137:20251110', uuid: 'u-one', tx_number: 999 },
      { ignoreDuplicates: false },
    ]);
    expect(a).not.toBe(c);
  });
});

describe('serializes toJSON-carrying class instances as their JSON form', () => {
  it('stores decimal-like value via toJSON, not as a plain object', () => {
    class DecimalLike {
      constructor(public n: string) {}
      toJSON() {
        return this.n;
      }
    }
    const stored = serialize(new DecimalLike('1200'));
    expect(stored).toEqual({ t: 'string', v: '1200' });
    expect(deserialize(stored)).toBe('1200');
  });
});
