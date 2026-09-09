import { describe, it, expect } from 'vitest';
import {
  serialize,
  deserialize,
  stableHash,
  makeCallKey,
  Mockable,
  SnapshotStore,
  getSnapshotStore,
  flushAllSnapshots,
  MockHandler,
  UnimockReplayMissError,
} from '../src';
import { TestService, Connector, ConnectorWithConnection } from './__mocks__/unimock';

vi.mock('../src/serializer', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/serializer')>();
  return {
    ...orig,
    stableHash: (value: unknown): string => {
      mockStableHashCount.value += 1;
      return orig.stableHash(value);
    },
    makeCallKey: (prefix: string, method: string, args: unknown[]): string => {
      mockMakeCallKeyCount.value += 1;
      return orig.makeCallKey(prefix, method, args);
    },
  };
});

const mockStableHashCount = { value: 0 };
const mockMakeCallKeyCount = { value: 0 };

afterAll(() => {
  SnapshotStore.setMode('off');
});

describe('serializer', () => {
  it('serialize/deserialize primitive types', () => {
    const cases = [undefined, null, true, 42, 'hello', BigInt(123)];
    for (const val of cases) {
      expect(deserialize(serialize(val))).toEqual(val);
    }
  });

  it('serialize/deserialize Date', () => {
    const d = new Date('2024-01-01');
    expect(deserialize(serialize(d))).toEqual(d);
  });

  it('serialize/deserialize RegExp', () => {
    const r = /test/gi;
    const des = deserialize(serialize(r)) as RegExp;
    expect(des.source).toBe('test');
    expect(des.flags).toBe('gi');
  });

  it('serialize/deserialize Buffer', () => {
    const b = Buffer.from('hello');
    const des = deserialize(serialize(b)) as Buffer;
    expect(Buffer.isBuffer(des)).toBe(true);
    expect(des.toString()).toBe('hello');
  });

  it('serialize/deserialize Error', () => {
    const e = new Error('test error');
    const des = deserialize(serialize(e)) as Error;
    expect(des.message).toBe('test error');
    expect(des.name).toBe('Error');
  });

  it('serialize/deserialize plain object', () => {
    const obj = { a: 1, b: { c: 'nested' } };
    expect(deserialize(serialize(obj))).toEqual(obj);
  });

  it('serialize/deserialize array', () => {
    const arr = [1, 'two', { three: 3 }];
    expect(deserialize(serialize(arr))).toEqual(arr);
  });

  it('stableHash is deterministic', () => {
    const a = stableHash({ b: 1, a: 2 });
    const b = stableHash({ a: 2, b: 1 });
    expect(a).toBe(b);
  });

  it('makeCallKey produces different keys for different args', () => {
    const k1 = makeCallKey('', 'query', ['SELECT 1']);
    const k2 = makeCallKey('', 'query', ['SELECT 2']);
    expect(k1).not.toBe(k2);
  });
});

describe('SnapshotStore', () => {
  it('stores and retrieves calls', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestClass');
    store.record('key1', {
      args: [{ t: 'string', v: 'arg1' }],
      result: { t: 'number', v: 42 },
    });
    expect(store.get('key1')!.result).toEqual({ t: 'number', v: 42 });
  });

  it('returns undefined for missing key', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestClass');
    expect(store.get('nonexistent')).toBeUndefined();
  });
});

describe('Mockable decorator', () => {
  it('wraps method calls in record mode', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ importMeta: import.meta })
    class MockedService extends TestService {}

    const service = new MockedService();
    const result = await service.query('SELECT 1');
    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('replays method calls from snapshot', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedService extends TestService {}

    const service1 = new MockedService();
    await service1.query('SELECT 1');
    await service1.query('SELECT 2');

    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const service2 = new MockedService();

    expect(await service2.query('SELECT 1')).toEqual({ data: [1, 2, 3] });
    expect(await service2.query('SELECT 2')).toEqual({ data: [1, 2, 3] });
  });

  it('handles getters in record and replay', () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedService extends TestService {}

    const s1 = new MockedService();
    expect(s1.value).toBe('real-value');
    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const s2 = new MockedService();
    expect(s2.value).toBe('real-value');
  });

  it('throws on missing snapshot in replay mode', () => {
    SnapshotStore.setMode('replay');

    @Mockable({ importMeta: import.meta })
    class MockedService extends TestService {}

    const service = new MockedService();
    expect(() => service.query('UNKNOWN')).toThrow(UnimockReplayMissError);
  });

  it('does nothing in off mode', async () => {
    SnapshotStore.setMode('off');

    @Mockable({ importMeta: import.meta })
    class MockedService extends TestService {}

    const service = new MockedService();
    expect(await service.query('SELECT 1')).toEqual({ data: [1, 2, 3] });
  });

  it('records and replays async methods with resolved value', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedService extends TestService {}

    const s1 = new MockedService();
    expect(await s1.query('hello')).toEqual({ data: [1, 2, 3] });
    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const s2 = new MockedService();
    expect(await s2.query('hello')).toEqual({ data: [1, 2, 3] });
  });

  it('records and replays subscribe with callback', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedService extends TestService {}

    const received: string[] = [];
    const s1 = new MockedService();
    await s1.subscribe('events', async (msg) => {
      received.push(msg);
    });
    expect(received).toEqual(['message-from-events']);
    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const replayed: string[] = [];
    const s2 = new MockedService();
    await s2.subscribe('events', async (msg) => {
      replayed.push(msg);
    });
    expect(replayed).toEqual(['message-from-events']);
  });
});

describe('MockHandler', () => {
  it('wraps object methods in record mode', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConn', '/tmp/unimock-test');

    const target = { query: (sql: string) => ({ rows: [1, 2] }) };
    const conn = new MockHandler(target, 'conn_1', store) as any;

    expect(conn.query('SELECT 1')).toEqual({ rows: [1, 2] });
  });

  it('is not a thenable', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConn');

    const target = { query: () => 1 };
    const conn = new MockHandler(target, 'conn_1', store) as any;

    expect(conn.then).toBeUndefined();
  });

  it('replays connection methods from snapshot', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnReplay', '/tmp/unimock-test');

    const target = {
      query: (sql: string) => ({ rows: [1, 2] }),
    };
    const conn = new MockHandler(target, 'conn_2', store) as any;
    conn.query('SELECT 1');
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('TestConnReplay', '/tmp/unimock-test');
    const replayConn = new MockHandler(null, 'conn_2', store2) as any;
    expect(replayConn.query('SELECT 1')).toEqual({ rows: [1, 2] });
  });

  it('wraps async connection methods', async () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnAsync', '/tmp/unimock-test');

    const target = { fetch: async (id: number) => ({ id, name: 'item' }) };
    const conn = new MockHandler(target, 'conn_3', store) as any;

    const result = await conn.fetch(42);
    expect(result).toEqual({ id: 42, name: 'item' });
  });

  it('replays async connection methods', async () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnReplayAsync', '/tmp/unimock-test');

    const target = { fetch: async (id: number) => ({ id, name: 'item' }) };
    const conn = new MockHandler(target, 'conn_4', store) as any;
    await conn.fetch(42);
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('TestConnReplayAsync', '/tmp/unimock-test');
    const replayConn = new MockHandler(null, 'conn_4', store2) as any;

    const result = await replayConn.fetch(42);
    expect(result).toEqual({ id: 42, name: 'item' });
  });
});

describe('Connector-like integration', () => {
  it('records connector.get().query() chain', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedConnector extends Connector {}

    const c1 = new MockedConnector();
    const conn1 = c1.get() as any;
    const result1 = await conn1.query('SELECT 1');
    expect(result1).toEqual([{ result: 'SELECT 1' }]);
    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const c2 = new MockedConnector();
    const conn2 = c2.get() as any;
    const result2 = await conn2.query('SELECT 1');
    expect(result2).toEqual([{ result: 'SELECT 1' }]);
  });

  it('records and replays query that internally calls connection()', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: '/tmp/unimock-test' })
    class MockedConn extends ConnectorWithConnection {}

    const c1 = new MockedConn();
    const result1 = await c1.query('SELECT 1');
    expect(result1).toEqual([{ result: 'SELECT 1' }]);
    flushAllSnapshots();

    SnapshotStore.setMode('replay');
    const c2 = new MockedConn();
    const result2 = await c2.query('SELECT 1');
    expect(result2).toEqual([{ result: 'SELECT 1' }]);
  });
});

describe('off mode — zero-overhead fast path', () => {
  class OffPathService {
    public compute(input: { a: number }): number {
      return input.a * 2;
    }

    public static ping(id: number): number {
      return id + 1;
    }
  }

  it('does not hash call args of wrapped methods in off mode', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('off');
    mockStableHashCount.value = 0;
    mockMakeCallKeyCount.value = 0;

    try {
      @Mockable({ importMeta: import.meta })
      class MockedOffPath extends OffPathService {}

      const service = new MockedOffPath();
      for (let i = 0; i < 100; i++) {
        expect(service.compute({ a: i })).toBe(i * 2);
      }

      expect(
        mockMakeCallKeyCount.value,
        `makeCallKey was computed ${mockMakeCallKeyCount.value}x in off mode ` +
          `(stableHash boundary calls: ${mockStableHashCount.value}) — off mode must be a zero-overhead pass-through`,
      ).toBe(0);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('returns original results without touching the store in off mode (method + static)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('off');

    try {
      @Mockable({ importMeta: import.meta, statics: [['ping']] })
      class MockedOffPathStatics extends OffPathService {}

      const service = new MockedOffPathStatics();
      const store = getSnapshotStore('MockedOffPathStatics', undefined, import.meta);

      expect(service.compute({ a: 21 })).toBe(42);
      expect(MockedOffPathStatics.ping(1)).toBe(2);

      expect(Object.keys((store as any).data.calls)).toHaveLength(0);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('toPlain — recursive static-result conversion (record mode)', () => {
  /** Mimics a Sequelize model row: internal own-enumerable props + clean toJSON(). */
  class FakeRow {
    public dataValues: Record<string, unknown>;
    public _previousDataValues: Record<string, unknown>;
    public uniqno: number;

    constructor(row: Record<string, unknown>, uniqno: number) {
      this.dataValues = { ...row };
      this._previousDataValues = { ...row };
      this.uniqno = uniqno;
    }

    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }
  }

  /** Class instance WITHOUT toJSON — must be kept as-is (legacy behaviour). */
  class FakeRowNoToJSON {
    public field: number;
    public internal: string;

    constructor(field: number) {
      this.field = field;
      this.internal = 'secret-internal';
    }
  }

  class FakeRepository {
    public static findAll(): FakeRow[] {
      return [
        new FakeRow({ id: 1, name: 'one' }, 101),
        new FakeRow({ id: 2, name: 'two' }, 102),
      ];
    }

    public static now(): Date {
      return new Date('2024-06-01T12:00:00.000Z');
    }

    public static payload(): Buffer {
      return Buffer.from('hello');
    }

    public static pattern(): RegExp {
      return /abc/gi;
    }

    public static nested(): { label: string; plain: Date } {
      return { label: 'row', plain: new Date('2024-06-01T12:00:00.000Z') };
    }

    public static legacy(): FakeRowNoToJSON[] {
      return [new FakeRowNoToJSON(9)];
    }
  }

  const recordedCall = (store: ReturnType<typeof getSnapshotStore>, name: string): any =>
    (store as any).data.calls[`${name}:`];

  it('records arrays of toJSON instances as T_ARRAY of clean T_OBJECT rows (no dataValues/_previousDataValues/uniqno)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findAll']] })
      class MockedFakeRepository extends FakeRepository {}

      const live = MockedFakeRepository.findAll();
      expect(live).toHaveLength(2);
      expect(live.every((row) => row instanceof FakeRow)).toBe(true);

      const store = getSnapshotStore('MockedFakeRepository', '/tmp/unimock-test');
      const entry = recordedCall(store, 'findAll');
      expect(entry).toBeDefined();

      expect(entry.result.t).toBe('array');
      const rows = entry.result.v as Array<{
        t: string;
        v: Array<{ k: string; v: unknown }>;
      }>;
      expect(rows).toHaveLength(2);
      for (const row of rows) {
        expect(row.t).toBe('object');
        expect(row.v.map(({ k }) => k).sort()).toEqual(['id', 'name']);
      }
      const allKeys = rows.flatMap((row) => row.v.map(({ k }) => k));
      for (const dirty of ['dataValues', '_previousDataValues', 'uniqno']) {
        expect(allKeys).not.toContain(dirty);
      }
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('records a top-level Date static result as t: date (not an ISO string)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['now']] })
      class MockedNow extends FakeRepository {}

      const live = MockedNow.now();
      expect(live).toBeInstanceOf(Date);

      const store = getSnapshotStore('MockedNow', '/tmp/unimock-test');
      const entry = recordedCall(store, 'now');
      expect(entry.result).toEqual({ t: 'date', v: '2024-06-01T12:00:00.000Z' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('records Buffer and RegExp static results with native tags (pass-through)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({
        snapshotDir: '/tmp/unimock-test',
        statics: [['payload', 'pattern']],
      })
      class MockedTags extends FakeRepository {}

      expect(MockedTags.payload()).toEqual(Buffer.from('hello'));
      expect(MockedTags.pattern()).toEqual(/abc/gi);

      const store = getSnapshotStore('MockedTags', '/tmp/unimock-test');
      expect(recordedCall(store, 'payload').result).toEqual({
        t: 'buffer',
        v: 'aGVsbG8=',
      });
      expect(recordedCall(store, 'pattern').result).toEqual({
        t: 'regexp',
        v: { s: 'abc', f: 'gi' },
      });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('keeps a Date inside a nested plain object as t: date (recursion does not call toJSON on it)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['nested']] })
      class MockedNested extends FakeRepository {}

      MockedNested.nested();

      const store = getSnapshotStore('MockedNested', '/tmp/unimock-test');
      expect(recordedCall(store, 'nested').result).toEqual({
        t: 'object',
        v: [
          { k: 'label', v: { t: 'string', v: 'row' } },
          { k: 'plain', v: { t: 'date', v: '2024-06-01T12:00:00.000Z' } },
        ],
      });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('keeps class instances without toJSON as-is in arrays (legacy behaviour)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['legacy']] })
      class MockedLegacy extends FakeRepository {}

      MockedLegacy.legacy();

      const store = getSnapshotStore('MockedLegacy', '/tmp/unimock-test');
      expect(recordedCall(store, 'legacy').result).toEqual({
        t: 'array',
        v: [
          {
            t: 'object',
            v: [
              { k: 'field', v: { t: 'number', v: 9 } },
              { k: 'internal', v: { t: 'string', v: 'secret-internal' } },
            ],
          },
        ],
      });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('statics replay — instance reconstruction', () => {
  /**
   * Mimics a Sequelize model: instances expose a clean `toJSON()`/`get()`; the static
   *   `build()` is the reconstruction path — it marks the instance so tests can prove
   *   the ORIGINAL builder ran (replay reconstruction must not use the wrapped build).
   */
  class FakeModel {
    public dataValues: Record<string, unknown>;
    /** Set by the static build() — proof of reconstruction via the original builder. */
    public __rebuilt = false;
    public __isNewRecord?: boolean;

    constructor(values: Record<string, unknown>) {
      this.dataValues = { ...values };
    }

    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }

    public get(key: string): unknown {
      return this.dataValues[key];
    }

    public static build(
      values: Record<string, unknown>,
      options?: { isNewRecord?: boolean },
    ): FakeModel {
      const instance = new this(values);
      instance.__rebuilt = true;
      instance.__isNewRecord = options?.isNewRecord;
      return instance;
    }

    public static findOne(): FakeModel {
      return this.build({ id: 7, title: 'found' });
    }

    public static findAll(): FakeModel[] {
      return [this.build({ id: 1, title: 'one' }), this.build({ id: 2, title: 'two' })];
    }

    public static findOrCreate(): [FakeModel, boolean] {
      return [this.build({ id: 9, title: 'created' }), true];
    }

    public static update(): [number, FakeModel[]] {
      return [1, [this.build({ id: 3, title: 'updated' })]];
    }

    public static findAndCountAll(): { count: number; rows: FakeModel[] } {
      return { count: 1, rows: [this.build({ id: 4, title: 'counted' })] };
    }

    public static scope(_name: string): typeof FakeModel {
      return this;
    }

    public static custom(): { a: number } {
      return { a: 1 };
    }
  }

  it('rebuilds findOne result via original build (toJSON/get work, __rebuilt, isNewRecord=false)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findOne']] })
      class MockedReplayOne extends FakeModel {}

      const live = MockedReplayOne.findOne();
      expect(live.__rebuilt).toBe(true);
      expect(live.get('id')).toBe(7); // also records the instance-level get entry used in replay
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayOne.findOne() as FakeModel;
      expect(typeof r.toJSON).toBe('function');
      expect(r.__rebuilt).toBe(true);
      expect(r.__isNewRecord).toBe(false);
      expect(r.get('id')).toBe(7);
      expect(r.dataValues).toEqual({ id: 7, title: 'found' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('rebuilds every findAll row via original build', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findAll']] })
      class MockedReplayAll extends FakeModel {}

      const live = MockedReplayAll.findAll();
      expect(live).toHaveLength(2);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayAll.findAll() as FakeModel[];
      expect(r).toHaveLength(2);
      for (const row of r) {
        expect(row.__rebuilt).toBe(true);
      }
      expect(r.map((row) => row.dataValues)).toEqual([
        { id: 1, title: 'one' },
        { id: 2, title: 'two' },
      ]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('returns the decorated class itself for chain statics (scope)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['scope']] })
      class MockedReplayScope extends FakeModel {}

      expect(MockedReplayScope.scope('x')).toBe(MockedReplayScope);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      expect(MockedReplayScope.scope('x')).toBe(MockedReplayScope);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('rebuilds findOrCreate pair [instance, created]', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findOrCreate']] })
      class MockedReplayFoC extends FakeModel {}

      const [live] = MockedReplayFoC.findOrCreate();
      expect(live.__rebuilt).toBe(true);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayFoC.findOrCreate() as [FakeModel, boolean];
      expect(Array.isArray(r)).toBe(true);
      expect(r[0].__rebuilt).toBe(true);
      expect(r[1]).toBe(true);
      expect(r[0].dataValues).toEqual({ id: 9, title: 'created' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('rebuilds update pair [count, [instance]]', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['update']] })
      class MockedReplayUpdate extends FakeModel {}

      MockedReplayUpdate.update();
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayUpdate.update() as [number, FakeModel[]];
      expect(r[0]).toBe(1);
      expect(Array.isArray(r[1])).toBe(true);
      expect(r[1]).toHaveLength(1);
      expect(r[1][0].__rebuilt).toBe(true);
      expect(r[1][0].dataValues).toEqual({ id: 3, title: 'updated' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('rebuilds findAndCountAll rows and keeps count', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findAndCountAll']] })
      class MockedReplayCount extends FakeModel {}

      MockedReplayCount.findAndCountAll();
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayCount.findAndCountAll() as {
        count: number;
        rows: FakeModel[];
      };
      expect(r.count).toBe(1);
      expect(r.rows).toHaveLength(1);
      expect(r.rows[0].__rebuilt).toBe(true);
      expect(r.rows[0].dataValues).toEqual({ id: 4, title: 'counted' });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('keeps unknown-shape static results plain (no reconstruction)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['custom']] })
      class MockedReplayCustom extends FakeModel {}

      expect(MockedReplayCustom.custom()).toEqual({ a: 1 });
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const r = MockedReplayCustom.custom() as Record<string, unknown>;
      expect(r).toEqual({ a: 1 });
      expect(r.__rebuilt).toBeUndefined();
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('replays build() itself without replay-lookup miss (only build was recorded)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['build']] })
      class MockedReplayBuild extends FakeModel {}

      const live = MockedReplayBuild.build(
        { id: 5, title: 'direct' },
        { isNewRecord: true },
      );
      expect(live.__rebuilt).toBe(true);
      expect(live.get('id')).toBe(5); // also records the instance-level get entry used in replay
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      // Reconstruction must go through the ORIGINAL build, not the wrapped one:
      // the wrapped build would do a replay-lookup for { isNewRecord: false } args
      // that were never recorded and throw UnimockReplayMissError.
      expect(() =>
        MockedReplayBuild.build({ id: 5, title: 'direct' }, { isNewRecord: true }),
      ).not.toThrow(UnimockReplayMissError);
      const r = MockedReplayBuild.build(
        { id: 5, title: 'direct' },
        { isNewRecord: true },
      ) as FakeModel;
      expect(r.__rebuilt).toBe(true);
      expect(r.__isNewRecord).toBe(false);
      expect(r.get('id')).toBe(5);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('instance method refId scoping (production pattern)', () => {
  /**
   * Mimics the production pattern (CommonCrudRepositoryAdapter.toEntity:
   *   `rows.map((item) => item.toJSON())`) — per-row instance method calls on
   *   instances returned directly from wrapped statics. Also exposes a getter
   *   to prove wrapGetter scoping.
   */
  class RefIdModel {
    public dataValues: Record<string, unknown>;
    public __rebuilt = false;
    public __isNewRecord?: boolean;

    constructor(values: Record<string, unknown>) {
      this.dataValues = { ...values };
    }

    public get title(): string {
      return this.dataValues['title'] as string;
    }

    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }

    public get(key: string): unknown {
      return this.dataValues[key];
    }

    public static build(
      values: Record<string, unknown>,
      options?: { isNewRecord?: boolean },
    ): RefIdModel {
      const instance = new this(values);
      instance.__rebuilt = true;
      instance.__isNewRecord = options?.isNewRecord;
      return instance;
    }

    public static findOne(): RefIdModel {
      return this.build({ id: 7, title: 'seven' });
    }

    public static findAll(): RefIdModel[] {
      return [
        this.build({ id: 1, title: 'one' }),
        this.build({ id: 2, title: 'two' }),
        this.build({ id: 3, title: 'three' }),
      ];
    }

    public static findOrCreate(): [RefIdModel, boolean] {
      return [this.build({ id: 9, title: 'created' }), true];
    }

    public static update(): [number, RefIdModel[]] {
      return [1, [this.build({ id: 3, title: 'updated' })]];
    }

    public static findAndCountAll(): { count: number; rows: RefIdModel[] } {
      return { count: 1, rows: [this.build({ id: 4, title: 'counted' })] };
    }
  }

  /** The exact production adapter pattern: per-row toJSON on static-returned instances. */
  const toEntity = (items: RefIdModel[] | null | undefined): Record<string, unknown>[] =>
    (items ?? []).filter(Boolean).map((item) => item.toJSON());

  const entry = (store: ReturnType<typeof getSnapshotStore>, name: string): any =>
    (store as any).data.calls[`${name}:`];

  const THREE_ROWS = [
    { id: 1, title: 'one' },
    { id: 2, title: 'two' },
    { id: 3, title: 'three' },
  ];

  it('PRODUCTION PATTERN: rows.map(item => item.toJSON()) replays 3 distinct rows, not the last one x3', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['build', 'findAll']] })
      class MockedProdPattern extends RefIdModel {}

      const live = MockedProdPattern.findAll();
      // recordStaticResult must keep returning the RAW live result (T3 contract)
      expect(live.every((r) => r instanceof MockedProdPattern)).toBe(true);
      expect(toEntity(live)).toEqual(THREE_ROWS);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      // Pre-fix corruption signature: all 3 rows replay the LAST recorded row's data.
      expect(toEntity(MockedProdPattern.findAll())).toEqual(THREE_ROWS);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('MIXED FLOW: findOne + findAll in one record run — each instance replays its own row', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({
        snapshotDir: '/tmp/unimock-test',
        statics: [['build', 'findOne', 'findAll']],
      })
      class MockedProdMixed extends RefIdModel {}

      const found = MockedProdMixed.findOne();
      expect(found.toJSON()).toEqual({ id: 7, title: 'seven' });
      expect(toEntity(MockedProdMixed.findAll())).toEqual(THREE_ROWS);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      // Pre-fix: findOne result's toJSON() returned the last findAll row's data.
      expect(MockedProdMixed.findOne().toJSON()).toEqual({ id: 7, title: 'seven' });
      expect(toEntity(MockedProdMixed.findAll())).toEqual(THREE_ROWS);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('REFS SHAPES: entry.refs recorded per shape (single/array/pairInstance/pairCount/wrapper)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({
        snapshotDir: '/tmp/unimock-test',
        statics: [['findOne', 'findAll', 'findOrCreate', 'update', 'findAndCountAll']],
      })
      class MockedProdShapes extends RefIdModel {}

      MockedProdShapes.findOne();
      MockedProdShapes.findAll();
      MockedProdShapes.findOrCreate();
      MockedProdShapes.update();
      MockedProdShapes.findAndCountAll();

      const store = getSnapshotStore('MockedProdShapes', '/tmp/unimock-test');
      const ref = expect.stringMatching(/^ref_\d+$/);

      expect(entry(store, 'findOne').refs).toEqual(ref);
      expect(entry(store, 'findAll').refs).toStrictEqual([ref, ref, ref]);
      expect(entry(store, 'findOrCreate').refs).toStrictEqual([ref, undefined]);
      expect(entry(store, 'update').refs).toStrictEqual([undefined, [ref]]);
      expect(entry(store, 'findAndCountAll').refs).toStrictEqual({ rows: [ref] });
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('OLD FORMAT: entry without refs falls back to the legacy T3 rebuild path (no crash)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['build', 'findAll']] })
      class MockedProdLegacy extends RefIdModel {}

      toEntity(MockedProdLegacy.findAll());

      const store = getSnapshotStore('MockedProdLegacy', '/tmp/unimock-test');
      // Simulate an old-format snapshot: no refs markup on the static entry + a single
      // shared legacy `toJSON:` slot (last recorded row wins) — exactly what the
      // pre-refId code wrote; delete the scoped connection entries.
      const calls = (store as any).data.calls as Record<string, any>;
      delete calls['findAll:'].refs;
      calls['toJSON:'] = { args: [], result: serialize({ id: 3, title: 'three' }) };
      for (const key of Object.keys(calls)) {
        if (key.startsWith('call:')) delete calls[key];
      }
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const rows = MockedProdLegacy.findAll() as RefIdModel[];
      expect(rows).toHaveLength(3);
      expect(rows.every((r) => r instanceof MockedProdLegacy)).toBe(true);
      // Legacy T3 rebuild: per-row dataValues come from the recorded plain rows.
      expect(rows.map((r) => r.dataValues)).toEqual(THREE_ROWS);
      // Legacy shared slot: every row's toJSON() returns the last recorded row —
      // the old (buggy but crash-free) semantics, not a regression.
      expect(rows.map((r) => r.toJSON())).toEqual([
        { id: 3, title: 'three' },
        { id: 3, title: 'three' },
        { id: 3, title: 'three' },
      ]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('REPLAY MISS: unrecorded method on a ref-id instance still throws UnimockReplayMissError', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['build', 'findAll']] })
      class MockedProdMiss extends RefIdModel {}

      toEntity(MockedProdMiss.findAll()); // only toJSON was invoked during record
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      const rows = MockedProdMiss.findAll() as RefIdModel[];
      expect(rows[0].toJSON()).toEqual({ id: 1, title: 'one' }); // recorded → replays
      expect(() => rows[0].get('id')).toThrow(UnimockReplayMissError); // never recorded
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });

  it('GETTER SCOPING: getter on ref-id instances records/replays per-instance', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({
        snapshotDir: '/tmp/unimock-test',
        statics: [['build', 'findOne', 'findAll']],
      })
      class MockedProdGetter extends RefIdModel {}

      const found = MockedProdGetter.findOne();
      expect(found.title).toBe('seven');
      const rows = MockedProdGetter.findAll();
      expect(rows.map((r) => r.title)).toEqual(['one', 'two', 'three']);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      // Pre-fix: the shared legacy `title:` slot returned the last recorded value
      // for every instance (findOne → 'three').
      expect(MockedProdGetter.findOne().title).toBe('seven');
      expect(MockedProdGetter.findAll().map((r) => r.title)).toEqual([
        'one',
        'two',
        'three',
      ]);
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});

describe('replay reconstruction — constructor-internal pass-through (1.10.1)', () => {
  /**
   * Mimics the Sequelize hydration-vs-reconstruction options mismatch (the T4
   *   "BUILD SEED" gap):
   *   - record: `findAll` hydrates rows via `this.build(row, hydrationOptions)`
   *     (`raw: true, attributes: [...]`) — the vanilla-style constructor calls the
   *     wrapped prototype `_initValues(values, hydrationOptions)` on a refId-less
   *     instance (unscoped call key, options that record mode only ever produced
   *     with `raw`/`attributes`).
   *   - replay: `rebuildInstance` runs the ORIGINAL `build(plain, { isNewRecord:
   *     false })` — a DIFFERENT options object → a different unscoped
   *     `_initValues` call key that record mode never produced →
   *     `UnimockReplayMissError` unless the reconstruction-internal pass-through
   *     forwards the inner wrapped call to the original. No seeded `build()` call
   *     is used or needed.
   */
  class ReconModel {
    public dataValues: Record<string, unknown> = {};
    /** The options the constructor-internal `_initValues` call saw. */
    public __initOptions?: Record<string, unknown>;

    constructor(values: Record<string, unknown>, options?: Record<string, unknown>) {
      this._initValues(values, options);
    }

    public _initValues(values: Record<string, unknown>, options?: Record<string, unknown>): void {
      this.dataValues = { ...values };
      this.__initOptions = options ? { ...options } : undefined;
    }

    public toJSON(): Record<string, unknown> {
      return { ...this.dataValues };
    }

    public static build(
      values: Record<string, unknown>,
      options?: Record<string, unknown>,
    ): ReconModel {
      return new this(values, options ? { ...options } : undefined);
    }

    public static findAll(_options: Record<string, unknown>): ReconModel[] {
      return [
        this.build({ id: 101, title: 'alpha' }, {
          isNewRecord: false,
          raw: true,
          attributes: ['id', 'title'],
        }),
        this.build({ id: 102, title: 'beta' }, {
          isNewRecord: false,
          raw: true,
          attributes: ['id', 'title'],
        }),
      ];
    }
  }

  it('replays findAll reconstruction without a seed (hydration vs reconstruction options differ)', () => {
    const prevMode = SnapshotStore.mode;
    SnapshotStore.setMode('record');

    try {
      @Mockable({ snapshotDir: '/tmp/unimock-test', statics: [['findAll', 'build']] })
      class MockedReconHydration extends ReconModel {}

      const live = MockedReconHydration.findAll({ where: { id: 101 } });
      expect(live).toHaveLength(2);
      expect(live.every((r) => r instanceof MockedReconHydration)).toBe(true);
      flushAllSnapshots();

      SnapshotStore.setMode('replay');
      // Pre-fix: this throws UnimockReplayMissError `no snapshot found for
      // call "_initValues:..."` — the reconstruction options were never recorded.
      const rows = MockedReconHydration.findAll({ where: { id: 101 } }) as ReconModel[];
      expect(rows).toHaveLength(2);
      // Post-construction calls are served from the recorded call:{refId}: entries.
      expect(rows.map((r) => r.toJSON())).toEqual([
        { id: 101, title: 'alpha' },
        { id: 102, title: 'beta' },
      ]);
      // The vanilla constructor ran the ORIGINAL _initValues (pass-through) with
      // the reconstruction options — instance state populated by the original.
      for (const r of rows) {
        expect(r.__initOptions).toEqual({ isNewRecord: false });
      }
    } finally {
      SnapshotStore.setMode(prevMode);
    }
  });
});
