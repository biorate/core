import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileSnapshotStore, MemorySnapshotStore, SnapshotData } from '../src/snapshot-store';
import * as fs from 'fs';
import * as path from 'path';

describe('@biorate/connector-mocks - FileSnapshotStore', () => {
  let store: FileSnapshotStore;
  let testSnapshotsDir: string;

  beforeEach(() => {
    testSnapshotsDir = path.join(process.cwd(), 'test-temp-snapshots');
    store = new FileSnapshotStore({
      snapshotsDir: testSnapshotsDir,
      fileExtension: '.test.json',
    });
  });

  afterEach(async () => {
    store.clear();
    // Cleanup test files
    if (fs.existsSync(testSnapshotsDir)) {
      fs.rmSync(testSnapshotsDir, { recursive: true, force: true });
    }
  });

  it('should save and load snapshots', async () => {
    const snapshotData: SnapshotData = {
      args: ['SELECT 1'],
      result: [{ result: 1 }],
      timestamp: new Date().toISOString(),
    };

    await store.save('TestConnector.query', snapshotData);
    const loaded = await store.load('TestConnector.query');

    expect(loaded).toEqual(snapshotData);
  });

  it('should return null for non-existent snapshots', async () => {
    const loaded = await store.load('NonExistent');
    expect(loaded).toBeNull();
  });

  it('should check if snapshot exists', async () => {
    await store.save('TestConnector.query', {
      args: [],
      result: {},
    });

    expect(await store.has('TestConnector.query')).toBe(true);
    expect(await store.has('NonExistent')).toBe(false);
  });

  it('should clear all snapshots', async () => {
    await store.save('TestConnector.query', {
      args: [],
      result: {},
    });
    await store.save('TestConnector.exec', {
      args: ['DROP TABLE'],
      result: true,
    });

    await store.clear();

    // Give file system time to sync
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(await store.has('TestConnector.query')).toBe(false);
    expect(await store.has('TestConnector.exec')).toBe(false);
  });

  it('should add timestamp if not provided', async () => {
    const snapshotData: SnapshotData = {
      args: ['SELECT 1'],
      result: [{ result: 1 }],
    };

    await store.save('TestConnector.query', snapshotData);
    const loaded = await store.load('TestConnector.query');

    expect(loaded?.timestamp).toBeDefined();
    expect(new Date(loaded!.timestamp!).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('should preserve metadata', async () => {
    const snapshotData: SnapshotData = {
      args: ['SELECT 1'],
      result: [{ result: 1 }],
      metadata: {
        duration: 42,
        connectionName: 'test-db',
      },
    };

    await store.save('TestConnector.query', snapshotData);
    const loaded = await store.load('TestConnector.query');

    expect(loaded?.metadata).toEqual({
      duration: 42,
      connectionName: 'test-db',
    });
  });

  it('should delete specific snapshot', async () => {
    await store.save('TestConnector.query', {
      args: [],
      result: {},
    });
    await store.save('TestConnector.exec', {
      args: [],
      result: {},
    });

    const deleted = await store.delete('TestConnector.query');

    expect(deleted).toBe(true);
    expect(await store.has('TestConnector.query')).toBe(false);
    expect(await store.has('TestConnector.exec')).toBe(true);
  });

  it('should return false when deleting non-existent snapshot', async () => {
    const deleted = await store.delete('NonExistent');
    expect(deleted).toBe(false);
  });
});

describe('@biorate/connector-mocks - MemorySnapshotStore', () => {
  let store: MemorySnapshotStore;

  beforeEach(() => {
    store = new MemorySnapshotStore();
  });

  it('should save and load snapshots', async () => {
    const snapshotData: SnapshotData = {
      args: ['SELECT 1'],
      result: [{ result: 1 }],
    };

    await store.save('TestConnector.query', snapshotData);
    const loaded = await store.load('TestConnector.query');

    expect(loaded).toEqual(snapshotData);
  });

  it('should return null for non-existent snapshots', async () => {
    const loaded = await store.load('NonExistent');
    expect(loaded).toBeNull();
  });

  it('should check if snapshot exists', async () => {
    await store.save('TestConnector.query', {
      args: [],
      result: {},
    });

    expect(await store.has('TestConnector.query')).toBe(true);
    expect(await store.has('NonExistent')).toBe(false);
  });

  it('should clear all snapshots', async () => {
    await store.save('TestConnector.query', {
      args: [],
      result: {},
    });

    await store.clear();

    expect(await store.has('TestConnector.query')).toBe(false);
  });
});
