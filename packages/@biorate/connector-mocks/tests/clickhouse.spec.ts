import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockClickhouse, mockClickhouseInstance, mockClickhouseWith } from '../src/clickhouse';
import { FileSnapshotStore, MemorySnapshotStore } from '../src/snapshot-store';
import { TestConnector } from './__mocks__/connector';
import * as fs from 'fs';
import * as path from 'path';

// Mock ClickhouseConnector for testing (since we can't import real one in tests)
// Note: namespace is passed via options to mockClickhouse* functions instead of overriding
class MockClickhouseConnector extends TestConnector {
  public override readonly namespace = 'MockClickhouseConnector';
}

describe('@biorate/connector-mocks - Clickhouse helpers', () => {
  let snapshotStore: MemorySnapshotStore;
  let testSnapshotsDir: string;

  beforeEach(() => {
    // Use absolute path to avoid issues with process.cwd() changing
    testSnapshotsDir = path.resolve(__dirname, 'test-temp-clickhouse-snapshots');
    snapshotStore = new MemorySnapshotStore();
  });

  afterEach(() => {
    // Cleanup test files
    if (fs.existsSync(testSnapshotsDir)) {
      fs.rmSync(testSnapshotsDir, { recursive: true, force: true });
    }
  });

  describe('mockClickhouse', () => {
    it('should create mockable with MemorySnapshotStore', async () => {
      const store = new MemorySnapshotStore();
      const connector = mockClickhouse(MockClickhouseConnector, {
        snapshotStore: store,
      } as any);

      await connector.create({ name: 'test' });
      const connection = connector.get();
      await connection.query('SELECT 1');

      // Check that snapshot was saved
      const snapshot = await store.load('MockClickhouseConnector.get.query');
      expect(snapshot).toBeDefined();
    });

    it('should accept custom namespace option', async () => {
      const store = new MemorySnapshotStore();
      const connector = mockClickhouse(MockClickhouseConnector, {
        namespace: 'CustomClickhouse',
        snapshotStore: store,
      } as any);

      await connector.create({ name: 'test' });
      const connection = connector.get();
      await connection.query('SELECT version()');

      // Check custom namespace was used
      const snapshot = await store.load('CustomClickhouse.get.query');
      expect(snapshot).toBeDefined();
    });
  });

  describe('mockClickhouseInstance', () => {
    it('should create mockable from existing instance', async () => {
      const store = new MemorySnapshotStore();
      const instance = new MockClickhouseConnector();
      await instance.create({ name: 'test' });

      const connector = mockClickhouseInstance(instance, {
        snapshotStore: store,
      } as any);

      const connection = connector.get();
      await connection.query('SELECT 1');

      // Should have saved snapshot
      const snapshot = await store.load('ClickhouseConnector.get.query');
      expect(snapshot).toBeDefined();
    });
  });

  describe('mockClickhouseWith', () => {
    it('should create mockable with debug option', async () => {
      const store = new MemorySnapshotStore();
      const connector = mockClickhouseWith(MockClickhouseConnector, {
        debug: true,
      });

      // Override snapshot store for testing
      (connector as any).snapshotStore = store;

      await connector.create({ name: 'test' });
      const connection = connector.get();

      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));

      await connection.query('SELECT 1');

      console.log = originalLog;
      expect(logs.some((l) => l.includes('Recording'))).toBe(true);
    });
  });

  describe('replay mode', () => {
    it('should return snapshot data in replay mode', async () => {
      const store = new MemorySnapshotStore();
      // Pre-populate with snapshot
      await store.save('MockClickhouseConnector.get.query', {
        args: ['SELECT 1'],
        result: [{ result: 42 }],
        timestamp: new Date().toISOString(),
      });

      const connector = mockClickhouse(MockClickhouseConnector, {
        mode: 'replay',
        snapshotStore: store,
      } as any);

      await connector.create({ name: 'test' });
      const connection = connector.get();

      const result = await connection.query('SELECT 1');

      // Should return snapshot data, not real result
      expect(result).toEqual([{ result: 42 }]);
    });

    it('should throw error when snapshot not found in replay mode', async () => {
      const store = new MemorySnapshotStore();
      // Don't pre-populate any snapshots

      const connector = mockClickhouse(MockClickhouseConnector, {
        mode: 'replay',
        snapshotStore: store,
      } as any);

      await connector.create({ name: 'test' });
      const connection = connector.get();

      // This should throw because no snapshots exist
      await expect(connection.query('SELECT 1')).rejects.toThrow('No snapshot');
    });
  });
});
