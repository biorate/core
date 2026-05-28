import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createMockable,
  mockable,
  detectMode,
  isReplayMode,
  isRecordMode,
  isPassthroughMode,
} from '../src/factory';
import { MemorySnapshotStore } from '../src/snapshot-store';
import { TestConnector } from './__mocks__/connector';

describe('@biorate/connector-mocks - detectMode', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should default to record mode when no env vars are set', () => {
    const result = detectMode();
    expect(result.mode).toBe('record');
    expect(result.source).toBe('default');
    expect(result.isDefault).toBe(true);
  });

  it('should use CONNECTOR_MOCK_MODE env var', () => {
    process.env.CONNECTOR_MOCK_MODE = 'replay';
    const result = detectMode();
    expect(result.mode).toBe('replay');
    expect(result.source).toBe('CONNECTOR_MOCK_MODE');
  });

  it('should use explicit mode over env vars', () => {
    process.env.CONNECTOR_MOCK_MODE = 'replay';
    const result = detectMode('record');
    expect(result.mode).toBe('record');
    expect(result.source).toBe('explicit');
  });

  it('should support passthrough mode', () => {
    process.env.MOCK_MODE = 'passthrough';
    const result = detectMode();
    expect(result.mode).toBe('passthrough');
  });

  it('should check env vars in order', () => {
    process.env.CONNECTOR_MOCK_MODE = 'record';
    process.env.VITEST_MOCK_MODE = 'replay';
    const result = detectMode();
    expect(result.mode).toBe('record'); // CONNECTOR_MOCK_MODE has priority
  });
});

describe('@biorate/connector-mocks - mode helpers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('isReplayMode should return true when mode is replay', () => {
    process.env.CONNECTOR_MOCK_MODE = 'replay';
    expect(isReplayMode()).toBe(true);
    expect(isRecordMode()).toBe(false);
  });

  it('isRecordMode should return true when mode is record', () => {
    process.env.CONNECTOR_MOCK_MODE = 'record';
    expect(isRecordMode()).toBe(true);
    expect(isReplayMode()).toBe(false);
  });

  it('isPassthroughMode should return true when mode is passthrough', () => {
    process.env.CONNECTOR_MOCK_MODE = 'passthrough';
    expect(isPassthroughMode()).toBe(true);
  });
});

describe('@biorate/connector-mocks - createMockable with transforms', () => {
  let snapshotStore: MemorySnapshotStore;

  beforeEach(() => {
    snapshotStore = new MemorySnapshotStore();
  });

  it('should apply transformArgs function', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
      transformArgs: (args) =>
        args.map((a) => (typeof a === 'string' ? a.toUpperCase() : a)),
    });

    const connection = mockableConn.get();
    await connection.store('key', 'value');

    const snapshot = await snapshotStore.load('TestConnector.get.store');
    expect(snapshot?.args).toEqual(['KEY', 'VALUE']);
  });

  it('should apply transformResult function', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
      transformResult: (result) =>
        <unknown>{
          ...result,
          _transformed: true,
        },
    });

    const connection = mockableConn.get();
    const result = (await connection.query('SELECT 1')) as any;

    // The transformResult wraps the result with _transformed flag
    expect(result._transformed).toBe(true);
    expect(result[0]).toEqual({ result: 1, sql: 'SELECT 1' });

    // Check snapshot has transformed result
    const snapshot = await snapshotStore.load('TestConnector.get.query');
    expect((snapshot?.result as any)._transformed).toBe(true);
  });

  it('should apply both transformArgs and transformResult', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
      transformArgs: (args) => [`transformed:${args[0]}`],
      transformResult: (result) => ({ transformed: true, original: result }),
    });

    const connection = mockableConn.get();
    await connection.fetch('originalKey');

    const snapshot = await snapshotStore.load('TestConnector.get.fetch');
    expect(snapshot?.args).toEqual(['transformed:originalKey']);
    expect(snapshot?.result.transformed).toBe(true);
  });

  it('should use custom namespace', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      namespace: 'CustomNamespace',
      mode: 'record',
      snapshotStore,
    });

    const connection = mockableConn.get();
    await connection.query('SELECT 1');

    const keys = Array.from((snapshotStore as any).store.keys());
    expect(keys.some((k: string) => k.includes('CustomNamespace'))).toBe(true);
  });

  it('should log in debug mode', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    const mockableConn = createMockable(connector, {
      mode: 'record',
      snapshotStore,
      debug: true,
    });

    const connection = mockableConn.get();
    await connection.query('SELECT 1');

    console.log = originalLog;
    expect(logs.some((l) => l.includes('Recording'))).toBe(true);
  });
});

describe('@biorate/connector-mocks - passthrough mode', () => {
  it('should return connector without proxying in passthrough mode', async () => {
    const connector = new TestConnector();
    await connector.create({ name: 'test' });

    const mockableConn = createMockable(connector, {
      mode: 'passthrough',
    });

    // In passthrough mode, should be the same object
    expect(mockableConn).toBe(connector);

    // Should work normally without snapshots
    const connection = mockableConn.get();
    const result = await connection.query('SELECT 1');
    expect(result).toEqual([{ result: 1, sql: 'SELECT 1' }]);
  });
});

describe('@biorate/connector-mocks - mockable factory', () => {
  let snapshotStore: MemorySnapshotStore;

  beforeEach(() => {
    snapshotStore = new MemorySnapshotStore();
  });

  it('should create mockable instance from class', async () => {
    const mockableConn = mockable(TestConnector, {
      mode: 'record',
      snapshotStore,
    });

    await mockableConn.create({ name: 'test' });
    const connection = mockableConn.get();
    await connection.query('SELECT 1');

    const keys = Array.from((snapshotStore as any).store.keys());
    expect(keys.some((k: string) => k.includes('TestConnector'))).toBe(true);
  });
});
