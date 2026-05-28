import { describe, it, expect, beforeEach } from 'vitest';
import { Mockable } from '../src/mockable';
import { MemorySnapshotStore } from '../src/snapshot-store';
import { TestConnector } from './__mocks__/connector';

let testSnapshotStore: MemorySnapshotStore;

@Mockable({ namespace: 'DecoratedConnector' })
class DecoratedConnector extends TestConnector {
  public override readonly namespace = 'DecoratedConnector';
}

@Mockable({ namespace: 'CustomDecorated' })
class CustomNamespaceConnector extends TestConnector {}

@Mockable()
class NoNamespaceConnector extends TestConnector {
  public override readonly namespace = 'NoNamespaceConnector';
}

@Mockable({ debug: true })
class DebugConnector extends TestConnector {}

function createTransformedConnector(store: MemorySnapshotStore) {
  @Mockable({
    transformArgs: (args: any[]) =>
      args.map((a) => (typeof a === 'string' ? a.toUpperCase() : a)),
    transformResult: (result: any) => ({ ...result, _transformed: true }) as any,
    snapshotStore: store,
  })
  class TransformedConnector extends TestConnector {}
  return TransformedConnector;
}

describe('@Mockable decorator', () => {
  beforeEach(() => {
    testSnapshotStore = new MemorySnapshotStore();
  });

  it('should create decorated connector instance', async () => {
    const connector = new DecoratedConnector();
    await connector.create({ name: 'test' });

    const connection = connector.get();
    expect(connection).toBeDefined();
    expect(typeof connection.query).toBe('function');
  });

  it('should execute real methods and save snapshots', async () => {
    const connector = new DecoratedConnector();
    (connector as any).snapshotStore = testSnapshotStore;
    await connector.create({ name: 'test' });

    const connection = connector.get();
    const result = await connection.query('SELECT 1');

    expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);

    const keys = Array.from((testSnapshotStore as any).store.keys());
    expect(keys.some((k: string) => k.includes('DecoratedConnector.get.query'))).toBe(true);
  });

  it('should return snapshot data when available', async () => {
    const recordConnector = new DecoratedConnector();
    (recordConnector as any).snapshotStore = testSnapshotStore;
    await recordConnector.create({ name: 'test' });

    const recordConnection = recordConnector.get();
    await recordConnection.query('SELECT original');

    const replayConnector = new DecoratedConnector();
    (replayConnector as any).snapshotStore = testSnapshotStore;
    await replayConnector.create({ name: 'test' });

    const replayConnection = replayConnector.get();
    const result = await replayConnection.query('SELECT original');

    expect(result).toEqual([{ result: 1, sql: 'SELECT original' }]);
  });

  it('should execute real method when snapshot not found', async () => {
    const connector = new DecoratedConnector();
    (connector as any).snapshotStore = testSnapshotStore;
    await connector.create({ name: 'test' });

    const connection = connector.get();
    const result = await connection.query('SELECT 1');

    expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);
  });

  it('should apply transformArgs function', async () => {
    const transformStore = new MemorySnapshotStore();
    const TransformedConnector = createTransformedConnector(transformStore);
    const connector = new TransformedConnector();
    await connector.create({ name: 'test' });

    const connection = connector.get();
    await connection.store('key', 'value');

    const snapshot = await transformStore.load('TestConnector.get.store');
    expect(snapshot?.args).toEqual(['KEY', 'VALUE']);
  });

  it('should apply transformResult function', async () => {
    const transformStore = new MemorySnapshotStore();
    const TransformedConnector = createTransformedConnector(transformStore);
    const connector = new TransformedConnector();
    await connector.create({ name: 'test' });

    const connection = connector.get();
    const result = await connection.query('SELECT 1') as any;

    expect(result._transformed).toBe(true);

    const snapshot = await transformStore.load('TestConnector.get.query');
    expect((snapshot?.result as any)._transformed).toBe(true);
  });

  it('should log when recording snapshot', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));

    const connector = new DebugConnector();
    (connector as any).snapshotStore = testSnapshotStore;
    await connector.create({ name: 'test' });

    const connection = connector.get();
    await connection.query('SELECT 1');

    console.log = originalLog;
    expect(logs.some((l) => l.includes('Recording'))).toBe(true);
  });

  it('should cache proxied connections', async () => {
    const connector = new DecoratedConnector();
    await connector.create({ name: 'test' });

    const connection1 = connector.get();
    const connection2 = connector.get();

    expect(connection1).toBe(connection2);
  });

  it('should proxy current property', async () => {
    const connector = new DecoratedConnector();
    await connector.create({ name: 'test' });

    const current = connector.current;
    expect(current).toBeDefined();
    expect(typeof current.query).toBe('function');
  });

  it('should work with current using snapshots', async () => {
    const recordConnector = new DecoratedConnector();
    (recordConnector as any).snapshotStore = testSnapshotStore;
    await recordConnector.create({ name: 'test' });

    const recordCurrent = recordConnector.current;
    await recordCurrent.query('SELECT via current');

    const replayConnector = new DecoratedConnector();
    (replayConnector as any).snapshotStore = testSnapshotStore;
    await replayConnector.create({ name: 'test' });

    const replayCurrent = replayConnector.current;
    const result = await replayCurrent.query('SELECT via current');

    expect(result).toEqual([{ result: 1, sql: 'SELECT via current' }]);
  });

  it('should proxy connection method', async () => {
    const connector = new DecoratedConnector();
    await connector.create({ name: 'test' });

    const connection = connector.connection('test');
    expect(connection).toBeDefined();
    expect(typeof connection.query).toBe('function');
  });

  it('should use named connection in snapshot key', async () => {
    const connector = new DecoratedConnector();
    (connector as any).snapshotStore = testSnapshotStore;
    await connector.create({ name: 'test' });

    const connection = connector.connection('test');
    await connection.query('SELECT 1');

    const keys = Array.from((testSnapshotStore as any).store.keys());
    expect(keys.some((k: string) => k.includes('connection(test)'))).toBe(true);
  });
});
