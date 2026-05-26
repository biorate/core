import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { ClickhouseConnector } from '@biorate/clickhouse';
import { IORedisConnector } from '@biorate/ioredis';
import { MinioConnector } from '@biorate/minio';
import { MssqlConnector } from '@biorate/mssql';
import { OpenSearchConnector } from '@biorate/opensearch';
import { VaultConnector } from '@biorate/vault';
import {
  createTestHarness,
  dockerEndpoints,
  getProfileConfig,
  ITestHarness,
  ITestHarnessOptions,
  TestRootCtor,
  TestRootFromCtor,
} from '../src';

async function withHarness<TRootCtor extends TestRootCtor>(
  options: ITestHarnessOptions<TRootCtor>,
  run: (harness: ITestHarness<TestRootFromCtor<TRootCtor>>) => void | Promise<void>,
) {
  const harness = createTestHarness(options);
  await harness.run();
  try {
    await run(harness);
  } finally {
    harness.dispose();
  }
}

describe('@biorate/testing connectors', () => {
  it('getProfileConfig exposes docker endpoints for all compose services', () => {
    const config = getProfileConfig(
      [
        'pg',
        'redis',
        'ioredis',
        'kafka',
        'rdkafka',
        'amqp',
        'mongodb',
        'mssql',
        'clickhouse',
        'minio',
        'vault',
        'opensearch',
        'sequelize',
      ],
      'docker',
    );

    expect(config.Pg).toEqual([{ name: dockerEndpoints.pg.name, options: dockerEndpoints.pg.options }]);
    expect(config.IORedis).toEqual([
      { name: dockerEndpoints.ioredis.name, options: dockerEndpoints.ioredis.options },
    ]);
    expect(config.MongoDB).toEqual([
      {
        name: dockerEndpoints.mongodb.name,
        host: dockerEndpoints.mongodb.host,
        options: dockerEndpoints.mongodb.options,
      },
    ]);
    expect(config.RDKafkaGlobal).toEqual(dockerEndpoints.rdkafka.global);
  });

  it('memory ioredis set and get', async () => {
    class Root extends Core() {
      @inject(IORedisConnector) public connector!: IORedisConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['ioredis'] }, async (harness) => {
      expect(await harness.root.connector.current!.set('key', 'value')).toBe('OK');
      expect(await harness.root.connector.current!.get('key')).toBe('value');
      expect(await harness.root.connector.current!.del('key')).toBe(1);
    });
  });

  it('memory mssql runs queries', async () => {
    class Root extends Core() {
      @inject(MssqlConnector) public connector!: MssqlConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['mssql'] }, async (harness) => {
      await harness.root.connector.current?.query(`DROP TABLE IF EXISTS test;`);
      await harness.root.connector.current?.query(
        `CREATE TABLE test (count int, text varchar(20));`,
      );
      await harness.root.connector.current?.query(
        `INSERT INTO test (count, text) VALUES (1, 'a'), (2, 'b');`,
      );
      const result = await harness.root.connector.current?.query(`SELECT * FROM test;`);
      expect(result?.recordset).toEqual([
        { count: 1, text: 'a' },
        { count: 2, text: 'b' },
      ]);
    });
  });

  it('memory clickhouse query', async () => {
    class Root extends Core() {
      @inject(ClickhouseConnector) public connector!: ClickhouseConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['clickhouse'] }, async (harness) => {
      const cursor = await harness.root.connector
        .get()
        .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
      const { data } = await cursor.json<{ result: number }>();
      expect(data[0].result).toBe(1);
    });
  });

  it('memory minio put and get object', async () => {
    class Root extends Core() {
      @inject(MinioConnector) public connector!: MinioConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['minio'] }, async (harness) => {
      await harness.root.connector.current!.makeBucket('test');
      await harness.root.connector.current!.putObject(
        'test',
        'file.txt',
        Buffer.from('hello'),
      );

      const data = await new Promise<string>((resolve) => {
        void harness.root.connector.current!.getObject('test', 'file.txt').then((stream) => {
          let content = '';
          stream
            .on('data', (chunk: Buffer) => (content += chunk.toString('utf8')))
            .on('end', () => resolve(content));
        });
      });

      expect(data).toBe('hello');
    });
  });

  it('memory vault write and read', async () => {
    class Root extends Core() {
      @inject(VaultConnector) public connector!: VaultConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['vault'] }, async (harness) => {
      await harness.root.connector.current!.write('secret/data/test.json', {
        data: { hello: 'world' },
      });
      const res = await harness.root.connector.current!.read('secret/data/test.json');
      expect(res.data.data).toEqual({ hello: 'world' });
    });
  });

  it('memory opensearch creates index', async () => {
    class Root extends Core() {
      @inject(OpenSearchConnector) public connector!: OpenSearchConnector;
    }

    await withHarness({ root: Root, profile: 'memory', connectors: ['opensearch'] }, async (harness) => {
      const res = await harness.root.connector.current?.indices.create({
        index: 'test_index',
        body: {},
      });
      expect(res?.statusCode).toBe(200);
    });
  });
});
