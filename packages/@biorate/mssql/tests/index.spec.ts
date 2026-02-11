import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@biorate/mssql', () => {
  beforeAll(async () => {
    await root.$run();
    await root.connector!.current?.query(`DROP TABLE IF EXISTS test;`);
  });

  afterAll(async () => {
    await root.connector!.current?.query(`DROP TABLE IF EXISTS test;`);
  });

  it('create table', async () =>
    await root.connector!.current?.query(
      `CREATE TABLE test (
         count int,
         text varchar(20)
      );`,
    ));

  it('insert rows into table', async () =>
    await root.connector!.current?.query(
      `INSERT INTO test (count, text) VALUES (1, 'test1'), (2, 'test2'), (3, 'test3');`,
    ));

  it('select rows from table', async () =>
    expect(
      await root.connector!.current?.query(`SELECT * FROM test;`),
    ).toMatchSnapshot());
});
