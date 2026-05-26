import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { PgConnector, IPgConnector } from '@biorate/pg';
import { createTestHarness, dockerEndpoints, getProfileConfig, resolveTestProfile, setupBiorateTest } from '../src';

class PgRoot extends Core() {
  @inject(PgConnector) public connector!: IPgConnector;
}

describe('@biorate/testing harness', () => {
  it('resolveTestProfile defaults to memory', () => {
    expect(resolveTestProfile()).toBe('memory');
  });

  it('getProfileConfig exposes docker endpoints for pg', () => {
    const config = getProfileConfig(['pg'], 'docker');
    expect(config.Pg).toEqual([
      { name: dockerEndpoints.pg.name, options: dockerEndpoints.pg.options },
    ]);
  });

  describe('memory pg', () => {
    const harness = createTestHarness({
      root: PgRoot,
      profile: 'memory',
      connectors: ['pg'],
    });

    setupBiorateTest(harness);

    it('runs queries in memory', async () => {
      await harness.root.connector.current?.query(`DROP TABLE IF EXISTS test;`);
      await harness.root.connector.current?.query(
        `CREATE TABLE test (count int, text varchar(20));`,
      );
      await harness.root.connector.current?.query(
        `INSERT INTO test (count, text) VALUES (1, 'a'), (2, 'b');`,
      );
      const result = await harness.root.connector.current?.query(`SELECT * FROM test;`);
      expect(result?.rows).toEqual([
        { count: 1, text: 'a' },
        { count: 2, text: 'b' },
      ]);
    });
  });
});
