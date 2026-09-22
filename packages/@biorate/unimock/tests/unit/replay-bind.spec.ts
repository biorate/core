import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { Column, DataType, Model, Sequelize, Table } from '@biorate/sequelize';
import {
  MODE_OFF,
  MODE_RECORD,
  MODE_REPLAY,
  Mockable,
  SEQUELIZE_STATICS,
  SnapshotStore,
  bindReplaySequelizeModels,
} from '../../src';

@Mockable({ statics: [SEQUELIZE_STATICS] })
@Table({ tableName: 'bind_replay_model', timestamps: false })
class BindReplayModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id!: number;

  @Column(DataType.STRING)
  name!: string;
}

@Mockable({ statics: [SEQUELIZE_STATICS] })
@Table({ tableName: 'bind_replay_sqlite_model', timestamps: false })
class BindReplaySqliteModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id!: number;
}

const initialMode = SnapshotStore.mode;

afterAll(() => {
  SnapshotStore.setMode(initialMode);
});

describe('bindReplaySequelizeModels', () => {
  it('is a no-op (returns undefined) outside replay mode', () => {
    SnapshotStore.setMode(MODE_OFF);
    expect(bindReplaySequelizeModels(BindReplayModel)).toBeUndefined();
    expect(SnapshotStore.mode).toBe(MODE_OFF);

    SnapshotStore.setMode(MODE_RECORD);
    expect(bindReplaySequelizeModels(BindReplayModel)).toBeUndefined();
    expect(SnapshotStore.mode).toBe(MODE_RECORD);

    expect(BindReplayModel.isInitialized).toBe(false);
  });

  it('binds models to an offline Sequelize instance in replay mode and restores the mode', () => {
    SnapshotStore.setMode(MODE_REPLAY);

    const instance = bindReplaySequelizeModels(BindReplayModel, BindReplaySqliteModel);

    expect(instance).toBeInstanceOf(Sequelize);
    expect(BindReplayModel.isInitialized).toBe(true);
    expect(BindReplaySqliteModel.isInitialized).toBe(true);
    expect(SnapshotStore.mode).toBe(MODE_REPLAY);
  });

  it('accepts trailing constructor options (custom dialect)', () => {
    SnapshotStore.setMode(MODE_REPLAY);

    const instance = bindReplaySequelizeModels(BindReplaySqliteModel, {
      dialect: 'sqlite',
    });

    expect(instance).toBeInstanceOf(Sequelize);
    expect((instance as Sequelize).getDialect()).toBe('sqlite');
    expect(BindReplaySqliteModel.isInitialized).toBe(true);
    expect(SnapshotStore.mode).toBe(MODE_REPLAY);
  });
});

describe('bindReplaySequelizeModels — offline connection manager', () => {
  afterEach(() => {
    delete process.env.UNIMOCK_FALLBACK_ON_MISS;
    SnapshotStore.setMode(MODE_REPLAY);
  });

  it('returns an inert connection through the patched connection manager', async () => {
    SnapshotStore.setMode(MODE_REPLAY);

    const instance = bindReplaySequelizeModels(BindReplayModel);
    const cm = (
      instance as unknown as { connectionManager: { getConnection(): unknown } }
    ).connectionManager;

    const conn = (await cm.getConnection()) as {
      query(sql: string, cb?: (e: Error | null, r: object) => void): unknown;
    };
    const empty = { command: 'SELECT', rowCount: 0, rows: [], fields: [] };

    expect(await conn.query('SELECT setval(seq, 50)')).toEqual(empty);

    const cbResult = await new Promise((resolve) => {
      conn.query('SELECT 1', (e, r) => resolve(e ?? r));
    });
    expect(cbResult).toEqual(empty);
  });

  it('serves a raw query through Model.sequelize without touching the network', async () => {
    SnapshotStore.setMode(MODE_REPLAY);

    const instance = bindReplaySequelizeModels(BindReplayModel) as Sequelize;

    const [rows] = await instance.query('SELECT setval("seq", 50)');
    expect(rows).toEqual([]);

    await expect(instance.authenticate()).resolves.toBeUndefined();
  });

  it('lets a direct transaction begin and rollback offline', async () => {
    SnapshotStore.setMode(MODE_REPLAY);

    const instance = bindReplaySequelizeModels(BindReplayModel) as Sequelize;

    const tx = await instance.transaction();
    await expect(tx.rollback()).resolves.toBeUndefined();
  });

  it('keeps the live connection manager when UNIMOCK_FALLBACK_ON_MISS=1', () => {
    SnapshotStore.setMode(MODE_REPLAY);
    process.env.UNIMOCK_FALLBACK_ON_MISS = '1';

    const instance = bindReplaySequelizeModels(BindReplayModel);
    const cm = (instance as unknown as { connectionManager: Record<string, unknown> })
      .connectionManager;

    expect(cm['__unimock_offline_connection__']).toBeUndefined();
    expect(cm.getConnection).toBe(Object.getPrototypeOf(cm).getConnection);
  });
});
