import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SequelizeConnector as RawSequelizeConnector,
  ISequelizeConnector,
  Model,
  Table,
  Column,
  DataType,
} from '@biorate/sequelize';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../src';

const PG = {
  logging: false,
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  username: 'postgres',
  password: 'postgres',
  database: 'biorate_test',
};

const DDL = 'CREATE TABLE IF NOT EXISTS mock_models (id INTEGER PRIMARY KEY, title TEXT, value INTEGER)';
const DML = "INSERT INTO mock_models (id, title, value) VALUES (1, 'test', 42)";
const SELECT = 'SELECT * FROM mock_models ORDER BY id';
const SELECT_MODEL = 'SELECT * FROM mock_models WHERE id = 10 ORDER BY id';

@Mockable({ wrapStatics: true })
@Table({ tableName: 'mock_models', timestamps: false })
class TestModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.INTEGER)
  value: number;
}

@Mockable({})
class SequelizeConnector extends RawSequelizeConnector {
  protected readonly models = { connection: [TestModel] };
}

describe('@biorate/sequelize — connector.query() CRUD', () => {
  beforeAll(() => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  });

  afterAll(() => {
    [SequelizeConnector].forEach((c) => {
      try {
        if (container.isBound(c)) container.unbind(c);
      } catch {
        /* ok */
      }
    });
  });

  it('record', async () => {
    SnapshotStore.setMode('record');

    container.get<IConfig>(Types.Config).merge({
      Sequelize: [
        {
          name: 'connection',
          options: { ...PG },
        },
      ],
    });

    container.bind(SequelizeConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(SequelizeConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    await root.connector.query('DROP TABLE IF EXISTS mock_models CASCADE');
    const simple = await root.connector.query<{ result: number }>('SELECT 1 AS result');
    expect(simple[0].result).toBe(1);

    await root.connector.query(DDL);
    await root.connector.query(DML);
    const rows = await root.connector.query<{ id: number; title: string; value: number }>(SELECT);
    expect(rows[0].title).toBe('test');
    expect(rows[0].value).toBe(42);

    flushAllSnapshots();
    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    if (container.isBound(SequelizeConnector)) container.unbind(SequelizeConnector);
    container.bind(SequelizeConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(SequelizeConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const simple = await root.connector.query<{ result: number }>('SELECT 1 AS result');
    expect(simple[0].result).toBe(1);

    await root.connector.query(DDL);
    await root.connector.query(DML);
    const rows = await root.connector.query<{ id: number; title: string; value: number }>(SELECT);
    expect(rows[0].title).toBe('test');
    expect(rows[0].value).toBe(42);
  });
});

// ─── @Mockable on Model class — uses its own config namespace ──────────

@Mockable({})
class ModelMockConnector extends RawSequelizeConnector {
  protected readonly namespace = 'SequelizeModel';
  protected readonly models = { modelConn: [TestModel] };
}

describe('@biorate/sequelize — @Mockable on Model class', () => {
  beforeAll(() => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  });

  afterAll(() => {
    [ModelMockConnector].forEach((c) => {
      try {
        if (container.isBound(c)) container.unbind(c);
      } catch {
        /* ok */
      }
    });
  });

  it('record', async () => {
    SnapshotStore.setMode('record');

    container.get<IConfig>(Types.Config).merge({
      SequelizeModel: [
        {
          name: 'modelConn',
          options: { ...PG },
        },
      ],
    });

    container.bind(ModelMockConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(ModelMockConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    root.connector.use('modelConn');

    await root.connector.query('DROP TABLE IF EXISTS mock_models CASCADE');
    await TestModel.sync();
    await TestModel.create({ id: 10, title: 'via-mockable-model', value: 777 });
    const found = await TestModel.findOne({ where: { id: 10 } });
    expect(found?.toJSON()).toMatchObject({ id: 10, title: 'via-mockable-model', value: 777 });

    const rows = await root.connector.query<{ id: number; title: string; value: number }>(
      SELECT_MODEL,
    );
    expect(rows[0].title).toBe('via-mockable-model');

    flushAllSnapshots();
    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    if (container.isBound(ModelMockConnector)) container.unbind(ModelMockConnector);
    container.bind(ModelMockConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(ModelMockConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    root.connector.use('modelConn');

    const found = await TestModel.findOne({ where: { id: 10 } });
    expect(found).toMatchObject({ id: 10, title: 'via-mockable-model', value: 777 });

    const rows = await root.connector.query<{ id: number; title: string; value: number }>(
      SELECT_MODEL,
    );
    expect(rows[0].title).toBe('via-mockable-model');
  });
});
