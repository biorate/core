import { expect } from 'vitest';
import { root } from './__mocks__';

describe('@biorate/pg', () => {
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
      (await root.connector!.current?.query(`SELECT * FROM test;`))!.rows,
    ).toMatchSnapshot());

  it('cursor', () =>
    new Promise((done) => {
      const cursor = root.connector!.cursor('connection', `SELECT * FROM test;`);
      cursor.read(3, (err, rows) => {
        expect(err).toMatchSnapshot();
        expect(rows).toMatchSnapshot();
        cursor.close(() => done(void 0));
      });
    }));

  it('stream', () =>
    new Promise((done) => {
      const stream = root.connector!.stream('connection', `SELECT * FROM test;`);
      stream.on('data', (row) => expect(row).toMatchSnapshot());
      stream.on('end', () => done(void 0));
    }));
});
