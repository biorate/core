import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ISequelizeConnector } from '@biorate/sequelize';
import { SnapshotStore, flushAllSnapshots } from '../src';
import {
  PG,
  DDL,
  DML,
  SELECT,
  SELECT_MODEL,
  TestModel,
  SequelizeConnector,
  ModelMockConnector,
} from './__mocks__/sequelize';

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

  it('sequelize connector', async () => {
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
    const rows = await root.connector.query<{ id: number; title: string; value: number }>(
      SELECT,
    );
    expect(rows[0].title).toBe('test');
    expect(rows[0].value).toBe(42);

    flushAllSnapshots();
    container.unbind(Root);
  });
});

describe('@biorate/sequelize — @Mockable on Model class', () => {
  beforeAll(() => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  });

  afterAll(() => {
    for (const c of [ModelMockConnector]) if (container.isBound(c)) container.unbind(c);
  });

  it('model mock connector', async () => {
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
    expect(found).toMatchObject({
      id: 10,
      title: 'via-mockable-model',
      value: 777,
    });

    const rows = await root.connector.query<{ id: number; title: string; value: number }>(
      SELECT_MODEL,
    );
    expect(rows[0].title).toBe('via-mockable-model');

    flushAllSnapshots();
    container.unbind(Root);
  });
});
