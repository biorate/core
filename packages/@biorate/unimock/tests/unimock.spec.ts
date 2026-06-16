import { describe, it, expect, afterAll } from 'vitest';
import {
  serialize,
  deserialize,
  stableHash,
  makeCallKey,
  Mockable,
  SnapshotStore,
  flushAllSnapshots,
  ConnectionHandler,
  UnimockReplayMissError,
} from '../src';

class TestService {
  public async query(sql: string): Promise<{ data: number[] }> {
    return { data: [1, 2, 3] };
  }

  public get value(): string {
    return 'real-value';
  }

  public async subscribe(
    topic: string,
    handler: (msg: string) => Promise<void>,
  ): Promise<void> {
    await handler(`message-from-${topic}`);
  }
}

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

    @Mockable()
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

    @Mockable()
    class MockedService extends TestService {}

    const service = new MockedService();
    expect(() => service.query('UNKNOWN')).toThrow(UnimockReplayMissError);
  });

  it('does nothing in off mode', async () => {
    SnapshotStore.setMode('off');

    @Mockable()
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

describe('ConnectionHandler', () => {
  it('wraps object methods in record mode', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConn', '/tmp/unimock-test');

    const target = { query: (sql: string) => ({ rows: [1, 2] }) };
    const conn = new ConnectionHandler(target, 'conn_1', store) as any;

    expect(conn.query('SELECT 1')).toEqual({ rows: [1, 2] });
  });

  it('is not a thenable', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConn');

    const target = { query: () => 1 };
    const conn = new ConnectionHandler(target, 'conn_1', store) as any;

    expect(conn.then).toBeUndefined();
  });

  it('replays connection methods from snapshot', () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnReplay', '/tmp/unimock-test');

    const target = {
      query: (sql: string) => ({ rows: [1, 2] }),
    };
    const conn = new ConnectionHandler(target, 'conn_2', store) as any;
    conn.query('SELECT 1');
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('TestConnReplay', '/tmp/unimock-test');
    const replayConn = new ConnectionHandler(null, 'conn_2', store2) as any;
    expect(replayConn.query('SELECT 1')).toEqual({ rows: [1, 2] });
  });

  it('wraps async connection methods', async () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnAsync', '/tmp/unimock-test');

    const target = { fetch: async (id: number) => ({ id, name: 'item' }) };
    const conn = new ConnectionHandler(target, 'conn_3', store) as any;

    const result = await conn.fetch(42);
    expect(result).toEqual({ id: 42, name: 'item' });
  });

  it('replays async connection methods', async () => {
    SnapshotStore.setMode('record');
    const store = new SnapshotStore('TestConnReplayAsync', '/tmp/unimock-test');

    const target = { fetch: async (id: number) => ({ id, name: 'item' }) };
    const conn = new ConnectionHandler(target, 'conn_4', store) as any;
    await conn.fetch(42);
    store.flush();

    SnapshotStore.setMode('replay');
    const store2 = new SnapshotStore('TestConnReplayAsync', '/tmp/unimock-test');
    const replayConn = new ConnectionHandler(null, 'conn_4', store2) as any;

    const result = await replayConn.fetch(42);
    expect(result).toEqual({ id: 42, name: 'item' });
  });
});

describe('Connector-like integration', () => {
  class Connector {
    private conn = { query: async (sql: string) => [{ result: sql }] };
    public get() {
      return this.conn;
    }
  }

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

  class ConnectorWithConnection {
    private conn = { query: async (sql: string) => [{ result: sql }] };
    public connection() {
      return this.conn;
    }
    public async query(sql: string) {
      const conn = this.connection();
      return conn.query(sql);
    }
  }

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

afterAll(() => {
  flushAllSnapshots();
  SnapshotStore.setMode('off');
});
