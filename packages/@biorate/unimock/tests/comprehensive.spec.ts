import { Mockable, SnapshotStore, flushAllSnapshots, SEQUELIZE_STATICS } from '../src';

import { ComprehensiveService, WithSymbolsService } from './__mocks__/comprehensive';

const SNAPSHOT_DIR = '/tmp/unimock-test';

afterAll(() => {
  SnapshotStore.setMode('off');
});

describe('@Mockable() comprehensive coverage', () => {
  it('records all attribute types', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: SNAPSHOT_DIR, statics: [SEQUELIZE_STATICS] })
    class MockedComp extends ComprehensiveService {}

    const instance = new MockedComp();

    // --- Return types ---
    expect(instance.retString()).toBe('hello');
    expect(instance.retNumber()).toBe(42);
    expect(instance.retBoolean()).toBe(true);
    expect(instance.retNull()).toBeNull();
    expect(instance.retUndefined()).toBeUndefined();
    expect(instance.retBigInt()).toBe(123n);
    expect(instance.retDate()).toEqual(new Date('2024-06-17'));
    expect(instance.retRegExp()).toEqual(/test/gi);
    expect(instance.retBuffer() instanceof Buffer).toBe(true);
    expect(instance.retBuffer().toString()).toBe('hello');
    expect(instance.retError()).toBeInstanceOf(Error);
    expect(instance.retError().message).toBe('test-error');
    expect(instance.retPlainObject()).toEqual({ a: 1, b: { c: 2 } });
    expect(instance.retArray()).toEqual([1, 2, 3]);

    // --- Args differentiation ---
    expect(instance.sum(1, 2)).toBe(3);
    expect(instance.sum(10, 20)).toBe(30);
    expect(instance.sum(1, 2)).toBe(3); // same args → same cached result

    // --- Class instance (hasMethods → wrapped in ConnectionHandler) ---
    const other = instance.retClassInstance();
    expect(other.doSomething()).toBe('other-done');

    // --- Connection (hasMethods) ---
    const conn = instance.retConnection();
    expect(conn.query('sql1')).toBe('result: sql1');

    // --- Async ---
    expect(await instance.asyncRetString()).toBe('async-hello');
    const asyncConn = await instance.asyncRetConnection();
    expect(asyncConn.query('async-sql')).toBe('async-result: async-sql');

    // --- Getters ---
    expect(instance.plainGetter).toBe('plain-getter');
    const getterConn = instance.connection;
    expect(getterConn.query('getter-sql')).toBe('getter: getter-sql');

    // --- No args ---
    expect(instance.noArgs()).toBe('no-args');

    // --- Callbacks ---
    const syncCb = vi.fn();
    expect(instance.withSyncCallback(syncCb)).toBe('sync-cb-done');
    expect(syncCb).toHaveBeenCalledWith('sync-called');

    const asyncCb = vi.fn();
    expect(await instance.withAsyncCallback(asyncCb)).toBe('async-cb-done');
    expect(asyncCb).toHaveBeenCalledWith('async-called');

    // --- Static (SEQUELIZE_STATICS methods are wrapped) ---
    expect(MockedComp.count()).toBe(42);
    expect(MockedComp.sync()).toBe('synced');

    // --- Throws ---
    expect(() => instance.throwSync()).toThrow('sync-error');
    await expect(instance.throwAsync()).rejects.toThrow('async-error');

    flushAllSnapshots();
  });

  it('replays all attribute types', async () => {
    SnapshotStore.setMode('replay');

    @Mockable({ snapshotDir: SNAPSHOT_DIR, statics: [SEQUELIZE_STATICS] })
    class MockedComp extends ComprehensiveService {}

    const instance = new MockedComp();

    // --- Return types ---
    expect(instance.retString()).toBe('hello');
    expect(instance.retNumber()).toBe(42);
    expect(instance.retBoolean()).toBe(true);
    expect(instance.retNull()).toBeNull();
    expect(instance.retUndefined()).toBeUndefined();
    expect(instance.retBigInt()).toBe(123n);
    expect(instance.retDate()).toEqual(new Date('2024-06-17'));
    expect(instance.retRegExp()).toEqual(/test/gi);
    expect(instance.retBuffer() instanceof Buffer).toBe(true);
    expect(instance.retBuffer().toString()).toBe('hello');
    expect(instance.retError()).toBeInstanceOf(Error);
    expect(instance.retError().message).toBe('test-error');
    expect(instance.retPlainObject()).toEqual({ a: 1, b: { c: 2 } });
    expect(instance.retArray()).toEqual([1, 2, 3]);

    // --- Args differentiation ---
    expect(instance.sum(1, 2)).toBe(3);
    expect(instance.sum(10, 20)).toBe(30);
    expect(instance.sum(1, 2)).toBe(3);

    // --- Class instance (from T_REF → ConnectionHandler) ---
    const other = instance.retClassInstance();
    expect(other.doSomething()).toBe('other-done');

    // --- Connection (from T_REF → ConnectionHandler) ---
    const conn = instance.retConnection();
    expect(conn.query('sql1')).toBe('result: sql1');

    // --- Async ---
    expect(await instance.asyncRetString()).toBe('async-hello');
    const asyncConn = await instance.asyncRetConnection();
    expect(asyncConn.query('async-sql')).toBe('async-result: async-sql');

    // --- Getters ---
    expect(instance.plainGetter).toBe('plain-getter');
    const getterConn = instance.connection;
    expect(getterConn.query('getter-sql')).toBe('getter: getter-sql');

    // --- No args ---
    expect(instance.noArgs()).toBe('no-args');

    // --- Callbacks (replayed from snapshot) ---
    const syncCb = vi.fn();
    expect(instance.withSyncCallback(syncCb)).toBe('sync-cb-done');
    expect(syncCb).toHaveBeenCalledWith('sync-called');

    const asyncCb = vi.fn();
    expect(await instance.withAsyncCallback(asyncCb)).toBe('async-cb-done');
    expect(asyncCb).toHaveBeenCalledWith('async-called');

    // --- Static (replayed from snapshot) ---
    expect(MockedComp.count()).toBe(42);
    expect(MockedComp.sync()).toBe('synced');

    // --- Throws (replayed from snapshot — sync throw in replay) ---
    expect(() => instance.throwSync()).toThrow('sync-error');
    expect(() => instance.throwAsync()).toThrow('async-error');
  });

  it('does not call originals in replay mode', () => {
    SnapshotStore.setMode('replay');

    const spy = vi.spyOn(ComprehensiveService.prototype, 'retString');

    @Mockable({ snapshotDir: SNAPSHOT_DIR })
    class MockedComp extends ComprehensiveService {}

    const instance = new MockedComp();
    instance.retString();

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe('@Mockable({ symbols: true })', () => {
  it('records and replays symbol values', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: SNAPSHOT_DIR, symbols: true })
    class MockedSymbols extends WithSymbolsService {}

    const rec = new MockedSymbols();
    expect(typeof rec.getSymbol()).toBe('symbol');
    expect((rec.getSymbol() as symbol).description).toBe('test-symbol');
    expect(rec.retUndefined()).toBeUndefined();

    flushAllSnapshots();

    SnapshotStore.setMode('replay');

    // Reuse same class name so snapshot file matches
    const rep = new MockedSymbols();
    const sym = rep.getSymbol();
    expect(typeof sym).toBe('symbol');
    expect((sym as symbol).description).toBe('test-symbol');
    expect(rep.retUndefined()).toBeUndefined();
  });
});

describe('@Mockable() without symbols (default)', () => {
  it('does not break on symbol values', async () => {
    SnapshotStore.setMode('record');

    @Mockable({ snapshotDir: SNAPSHOT_DIR })
    class MockedDefault extends WithSymbolsService {}

    const rec = new MockedDefault();
    // Record mode returns the original value (a real symbol)
    expect(typeof rec.getSymbol()).toBe('symbol');

    flushAllSnapshots();

    // Replay mode deserializes the T_STRING marker back as '<symbol>' string
    SnapshotStore.setMode('replay');
    const rep = new MockedDefault();
    const replayed = rep.getSymbol();
    expect(typeof replayed).toBe('string');
    expect(replayed).toBe('<symbol>');
  });
});
