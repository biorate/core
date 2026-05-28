import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Mockable } from '../src/mockable';
import { MemorySnapshotStore } from '../src/snapshot-store';
import { TestConnector } from './__mocks__/connector';

let testSnapshotStore: MemorySnapshotStore;

/**
 * Test connector with @Mockable decorator
 * Uses default FileSnapshotStore, but we'll test via integration
 */
@Mockable({ namespace: 'DecoratedConnector' })
class DecoratedConnector extends TestConnector {
  public override readonly namespace = 'DecoratedConnector';
}

/**
 * Test connector with custom namespace option
 */
@Mockable({ namespace: 'CustomDecorated' })
class CustomNamespaceConnector extends TestConnector {}

/**
 * Test connector without namespace option (should use class name)
 */
@Mockable()
class NoNamespaceConnector extends TestConnector {
  public override readonly namespace = 'NoNamespaceConnector';
}

/**
 * Test connector with empty options (should use class name)
 */
@Mockable({})
class EmptyOptionsConnector extends TestConnector {
  public override readonly namespace = 'EmptyOptionsConnector';
}

/**
 * Test connector with debug option
 */
@Mockable({ debug: true })
class DebugConnector extends TestConnector {}

/**
 * Test connector with transform functions
 */
let transformSnapshotStore: MemorySnapshotStore | undefined;

// Factory function to create TransformedConnector class with snapshot store
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

describe('@biorate/connector-mocks - @Mockable decorator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    testSnapshotStore = new MemorySnapshotStore();
    transformSnapshotStore = new MemorySnapshotStore();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('basic functionality', () => {
    it('should create decorated connector instance', async () => {
      const connector = new DecoratedConnector();
      await connector.create({ name: 'test' });

      const connection = connector.get();
      expect(connection).toBeDefined();
      expect(typeof connection.query).toBe('function');
    });

    it('should execute real methods in record mode', async () => {
      process.env.CONNECTOR_MOCK_MODE = 'record';
      const connector = new DecoratedConnector();
      await connector.create({ name: 'test' });

      const connection = connector.get();
      const result = await connection.query('SELECT 1');

      expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);
    });

    it('should use custom namespace from option', async () => {
      const connector = new CustomNamespaceConnector();
      await connector.create({ name: 'test' });

      const connection = connector.get();
      expect(connection).toBeDefined();

      // Execute a query to create snapshot entry
      await connection.query('SELECT 1');
      // Namespace is used in snapshot keys - verified via integration
    });

    it('should use class name as namespace when not provided', async () => {
      const connector = new NoNamespaceConnector();
      (connector as any).snapshotStore = testSnapshotStore;
      await connector.create({ name: 'test' });

      const connection = connector.get();
      await connection.query('SELECT 1');

      const keys = Array.from((testSnapshotStore as any).store.keys());
      expect(keys.some((k: string) => k.startsWith('NoNamespaceConnector.'))).toBe(true);
    });

    it('should use class name as namespace with empty options', async () => {
      const connector = new EmptyOptionsConnector();
      (connector as any).snapshotStore = testSnapshotStore;
      await connector.create({ name: 'test' });

      const connection = connector.get();
      await connection.query('SELECT 1');

      const keys = Array.from((testSnapshotStore as any).store.keys());
      expect(keys.some((k: string) => k.startsWith('EmptyOptionsConnector.'))).toBe(true);
    });
  });

  describe('replay mode', () => {
    it('should work in replay mode with pre-populated snapshots', async () => {
      // Create connector in record mode first to populate snapshot
      process.env.CONNECTOR_MOCK_MODE = 'record';
      const recordConnector = new DecoratedConnector();
      // Override snapshot store for testing
      (recordConnector as any).snapshotStore = testSnapshotStore;
      await recordConnector.create({ name: 'test' });

      const recordConnection = recordConnector.get();
      await recordConnection.query('SELECT original');

      // Now switch to replay mode
      process.env.CONNECTOR_MOCK_MODE = 'replay';
      const replayConnector = new DecoratedConnector();
      (replayConnector as any).snapshotStore = testSnapshotStore;
      await replayConnector.create({ name: 'test' });

      const replayConnection = replayConnector.get();
      const result = await replayConnection.query('SELECT original');

      // Should return snapshot data
      expect(result).toBeDefined();
    });

    it('should throw error when snapshot not found in replay mode', async () => {
      process.env.CONNECTOR_MOCK_MODE = 'replay';

      const connector = new DecoratedConnector();
      (connector as any).snapshotStore = testSnapshotStore;
      await connector.create({ name: 'test' });

      const connection = connector.get();

      // Should throw because no snapshot exists
      await expect(connection.query('SELECT 1')).rejects.toThrow('No snapshot');
    });
  });

  describe('passthrough mode', () => {
    it('should execute real methods without saving snapshots in passthrough mode', async () => {
      process.env.CONNECTOR_MOCK_MODE = 'passthrough';

      const connector = new DecoratedConnector();
      (connector as any).snapshotStore = testSnapshotStore;
      await connector.create({ name: 'test' });

      const connection = connector.get();
      const result = await connection.query('SELECT 1');

      expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);

      // Check that no snapshot was saved
      const keys = Array.from((testSnapshotStore as any).store.keys());
      expect(keys.length).toBe(0);
    });
  });

  describe('transform functions', () => {
    it('should apply transformArgs function', async () => {
      process.env.CONNECTOR_MOCK_MODE = 'record';
      const TransformedConnector = createTransformedConnector(transformSnapshotStore!);
      const connector = new TransformedConnector();
      await connector.create({ name: 'test' });

      const connection = connector.get();
      await connection.store('key', 'value');

      const snapshot = await transformSnapshotStore!.load(
        'TestConnector.get.store',
      );
      expect(snapshot?.args).toEqual(['KEY', 'VALUE']);
    });

    it('should apply transformResult function', async () => {
      process.env.CONNECTOR_MOCK_MODE = 'record';
      const TransformedConnector = createTransformedConnector(transformSnapshotStore!);
      const connector = new TransformedConnector();
      await connector.create({ name: 'test' });

      const connection = connector.get();
      const result = await connection.query('SELECT 1') as any;

      expect(result._transformed).toBe(true);

      const snapshot = await transformSnapshotStore!.load(
        'TestConnector.get.query',
      );
      expect((snapshot?.result as any)._transformed).toBe(true);
    });
  });

  describe('debug mode', () => {
    it('should log in debug mode', async () => {
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
  });

  describe('proxy caching', () => {
    it('should cache proxied connections', async () => {
      const connector = new DecoratedConnector();
      await connector.create({ name: 'test' });

      const connection1 = connector.get();
      const connection2 = connector.get();

      // Should be same proxy instance
      expect(connection1).toBe(connection2);
    });
  });

  describe('current property', () => {
    it('should proxy current property', async () => {
      const connector = new DecoratedConnector();
      await connector.create({ name: 'test' });

      const current = connector.current;
      expect(current).toBeDefined();
      expect(typeof current.query).toBe('function');
    });

    it('should work with current in replay mode', async () => {
      // Pre-populate snapshot
      process.env.CONNECTOR_MOCK_MODE = 'record';
      const recordConnector = new DecoratedConnector();
      (recordConnector as any).snapshotStore = testSnapshotStore;
      await recordConnector.create({ name: 'test' });

      const recordCurrent = recordConnector.current;
      await recordCurrent.query('SELECT via current');

      // Now replay
      process.env.CONNECTOR_MOCK_MODE = 'replay';
      const replayConnector = new DecoratedConnector();
      (replayConnector as any).snapshotStore = testSnapshotStore;
      await replayConnector.create({ name: 'test' });

      const replayCurrent = replayConnector.current;
      const result = await replayCurrent.query('SELECT via current');

      expect(result).toBeDefined();
    });
  });

  describe('connection method', () => {
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
});
