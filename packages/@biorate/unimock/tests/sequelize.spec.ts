import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { Model, Sequelize } from '@biorate/sequelize';
import { isReplay } from '../src';
import {
  DDL,
  DML,
  PG,
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
    if (isReplay()) {
      // Replay never executes the original `connect()` (it is replayed from
      // the connector snapshot), so TestModel is never bound to a Sequelize
      // instance and its sequelize-typescript `isInitialized` flag stays
      // false — the original static build() would throw
      // ModelNotInitializedError during replay reconstruction. Bind the model
      // to an offline Sequelize instance (the constructor performs no I/O)
      // to emulate what the real connect() does in record mode.
      new Sequelize({ ...PG, dialect: 'postgres' as const, models: [TestModel] });
    }
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

  it('model mock instance-returning statics', async () => {
    root2.connector.use('modelConn');

    // Replay reconstruction runs the ORIGINAL static build → `new TestModel(...)`,
    // and the vanilla constructor calls wrapped instance methods (_initValues/set)
    // on an instance that has no refId yet — unscoped call keys with the
    // reconstruction options ({ isNewRecord: false }). Record mode never executes
    // that exact path, so calling build() with the same args here (a real
    // record/replay bidirectional assertion) records those unscoped entries and
    // makes the replay reconstruction lookups hit.
    const seeded = TestModel.build(
      { id: 10, title: 'via-mockable-model', value: 777 },
      { isNewRecord: false },
    );
    expect(seeded.toJSON()).toMatchObject({
      id: 10,
      title: 'via-mockable-model',
      value: 777,
    });
    expect(seeded).toBeInstanceOf(Model);

    const all = await TestModel.findAll({ where: { id: 10 } });
    expect(all).toHaveLength(1);
    for (const found of all) {
      expect(found.toJSON()).toMatchObject({
        id: 10,
        title: 'via-mockable-model',
        value: 777,
      });
      expect(found).toBeInstanceOf(Model);
      expect(found.get('id')).toBe(10);
    }

    const counted = await TestModel.findAndCountAll({ where: { id: 10 } });
    expect(counted.count).toBe(1);
    expect(counted.rows).toHaveLength(1);
    const row = counted.rows[0];
    expect(row.toJSON()).toMatchObject({
      id: 10,
      title: 'via-mockable-model',
      value: 777,
    });
    expect(row).toBeInstanceOf(Model);
    expect(row.get('id')).toBe(10);

    const unscopedRows = await TestModel.unscoped().findAll({ where: { id: 10 } });
    expect(unscopedRows).toHaveLength(1);
    for (const found of unscopedRows) {
      expect(found.toJSON()).toMatchObject({
        id: 10,
        title: 'via-mockable-model',
        value: 777,
      });
      expect(found).toBeInstanceOf(Model);
      expect(found.get('id')).toBe(10);
    }
  });
});
