import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { PgConnector, IPgConnector } from '../src';
import { bindPg } from '../src/testing';
import { createTestHarness, setupBiorateTest } from '@biorate/testing';

class Root extends Core() {
  @inject(PgConnector) public connector!: IPgConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['pg'],
  binders: [bindPg],
});

setupBiorateTest(harness);

describe('@biorate/pg memory', () => {
  it('insert and select rows', async () => {
    await harness.root.connector.current?.query(`DROP TABLE IF EXISTS items;`);
    await harness.root.connector.current?.query(
      `CREATE TABLE items (count int, text varchar(20));`,
    );
    await harness.root.connector.current?.query(
      `INSERT INTO items (count, text) VALUES (1, 'one');`,
    );
    const result = await harness.root.connector.current?.query(`SELECT * FROM items;`);
    expect(result?.rows).toEqual([{ count: 1, text: 'one' }]);
  });
});
