import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import {
  DDL,
  DML,
  SELECT,
  SELECT_MODEL,
  TestModel,
  setupSequelize,
  teardownSequelize,
  setupModelMock,
  teardownModelMock,
} from './__mocks__/sequelize';

let root: Awaited<ReturnType<typeof setupSequelize>>;

describe('@biorate/sequelize — connector.query() CRUD', () => {
  beforeAll(async () => {
    root = await setupSequelize();
  });

  afterAll(() => {
    teardownSequelize();
  });

  it('sequelize connector', async () => {
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
  });
});

describe('@biorate/sequelize — @Mockable on Model class', () => {
  let root2: Awaited<ReturnType<typeof setupModelMock>>;

  beforeAll(async () => {
    root2 = await setupModelMock();
  });

  afterAll(() => {
    teardownModelMock();
  });

  it('model mock connector', async () => {
    root2.connector.use('modelConn');

    await root2.connector.query('DROP TABLE IF EXISTS mock_models CASCADE');
    await TestModel.sync();
    await TestModel.create({ id: 10, title: 'via-mockable-model', value: 777 });
    const found = await TestModel.findOne({ where: { id: 10 } });
    expect(found).toMatchObject({
      id: 10,
      title: 'via-mockable-model',
      value: 777,
    });

    const rows = await root2.connector.query<{
      id: number;
      title: string;
      value: number;
    }>(SELECT_MODEL);
    expect(rows[0].title).toBe('via-mockable-model');
  });
});
