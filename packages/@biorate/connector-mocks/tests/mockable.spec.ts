import { describe, it, expect, beforeEach } from 'vitest';
import { createMockable } from '../src/factory';
import { MemorySnapshotStore } from '../src/snapshot-store';
import { TestConnector, MockConnection } from './__mocks__/connector';

describe('@biorate/connector-mocks - createMockable factory', () => {
  let snapshotStore: MemorySnapshotStore;

  beforeEach(() => {
    snapshotStore = new MemorySnapshotStore();
  });

  describe('record mode', () => {
    it('should execute real methods and save snapshots', async () => {
      const connector = new TestConnector();
      await connector.create({ name: 'test' });

      const mockableConn = createMockable(connector, {
        mode: 'record',
        snapshotStore,
      });

      const connection = mockableConn.get();
      const result = await connection.query('SELECT 1');

      expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);
      // Check that snapshot was saved with correct key format
      const snapshot = await snapshotStore.load('TestConnector.get.query');
      expect(snapshot).toBeDefined();
      expect(snapshot?.args).toEqual(['SELECT 1']);
    });

    it('should save method arguments to snapshots', async () => {
      const connector = new TestConnector();
      await connector.create({ name: 'test' });

      const mockableConn = createMockable(connector, {
        mode: 'record',
        snapshotStore,
      });

      const connection = mockableConn.get();
      await connection.store('key', 'value');

      // Check snapshot was saved with correct args
      const snapshot = await snapshotStore.load('TestConnector.get.store');
      expect(snapshot).toBeDefined();
      expect(snapshot?.args).toEqual(['key', 'value']);
    });

    it('should proxy nested objects (deep proxy)', async () => {
      const connector = new TestConnector();
      await connector.create({ name: 'test' });

      const mockableConn = createMockable(connector, {
        mode: 'record',
        snapshotStore,
      });

      const connection = mockableConn.get();
      await connection.fetch('someKey');

      // Check that fetch snapshot was saved
      const snapshot = await snapshotStore.load('TestConnector.get.fetch');
      expect(snapshot).toBeDefined();
      expect(snapshot?.args).toEqual(['someKey']);
    });
  });

  describe('replay mode', () => {
    let prepopulatedStore: MemorySnapshotStore;

    beforeEach(async () => {
      prepopulatedStore = new MemorySnapshotStore();
      // Pre-populate snapshots with correct key format (namespace.get.methodName)
      await prepopulatedStore.save('TestConnector.get.query', {
        args: ['SELECT 1'],
        result: [{ result: 42, sql: 'SELECT 1' }],
      });
    });

    it('should return data from snapshots without calling real methods', async () => {
      const connector = new TestConnector();
      await connector.create({ name: 'test' });

      const mockableConn = createMockable(connector, {
        mode: 'replay',
        snapshotStore: prepopulatedStore,
      });

      const connection = mockableConn.get();
      const result = await connection.query('SELECT 1');

      // Should return snapshot data, not real method result
      expect(result).toEqual([{ result: 42, sql: 'SELECT 1' }]);
    });

    it('should throw error when snapshot not found', async () => {
      const connector = new TestConnector();
      await connector.create({ name: 'test' });

      const mockableConn = createMockable(connector, {
        mode: 'replay',
        snapshotStore: prepopulatedStore,
      });

      const connection = mockableConn.get();

      // fetch('nonexistent') has no snapshot, should throw
      await expect(connection.fetch('nonexistent')).rejects.toThrow(
        'No snapshot for'
      );
    });
  });
});

describe('@biorate/connector-mocks - custom namespace', () => {
  it('should use custom namespace for snapshots', async () => {
    const snapshotStore = new MemorySnapshotStore();
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      namespace: 'CustomNamespace',
      mode: 'record',
      snapshotStore,
    });

    const connection = mockableConn.get();
    await connection.query('SELECT 1');

    const snapshot = await snapshotStore.load('CustomNamespace.get.query');
    expect(snapshot).toBeDefined();
  });
});

describe('@biorate/connector-mocks - current and connection methods', () => {
  let snapshotStore: MemorySnapshotStore;

  beforeEach(() => {
    snapshotStore = new MemorySnapshotStore();
  });

  it('should proxy current connection', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
    });

    const connection = mockableConn.current;
    if (connection) {
      await connection.query('SELECT current');
      const snapshot = await snapshotStore.load('TestConnector.current.query');
      expect(snapshot).toBeDefined();
    }
  });

  it('should proxy named connection', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
    });

    const connection = mockableConn.connection('test');
    await connection.query('SELECT named');

    const snapshot = await snapshotStore.load('TestConnector.connection(test).query');
    expect(snapshot).toBeDefined();
  });
});
