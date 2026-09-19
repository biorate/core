import { afterAll, describe, expect, it } from 'vitest';
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
