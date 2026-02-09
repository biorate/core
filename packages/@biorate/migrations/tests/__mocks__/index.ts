import { use } from 'chai';
import { unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { ISchemaRegistryConnector } from '@biorate/schema-registry';
import * as Migrations from '../../src/types';
import { Root } from '../../src/root';

use(jestSnapshotPlugin());

const storage = join(tmpdir(), 'sqlite-test.db');

try {
  unlinkSync(storage);
} catch {}

class MockedSchemaRegistry extends Migrations.SchemaRegistry {
  protected async process() {
    await super.process();
    const { deleteSubjects } = container.get<ISchemaRegistryConnector>(
      Types.SchemaRegistry,
    ).current!;
    await Promise.all([
      deleteSubjects({
        subject: 'test2.avsc',
        permanent: false,
      }),
      deleteSubjects({
        subject: 'test.avsc',
        permanent: false,
      }),
    ]);
  }
}

container.unbind(Migrations.SchemaRegistry);
container
  .bind<Migrations.SchemaRegistry>(Migrations.SchemaRegistry)
  .to(MockedSchemaRegistry)
  .inSingletonScope();

container.get<Root>(Root).$run().catch(console.error);

container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name: 'sqlite',
      options: {
        logging: false,
        dialect: 'sqlite',
        storage,
      },
    },
  ],
  Minio: [
    {
      name: 'minio',
      options: {
        endPoint: 'localhost',
        port: 9000,
        accessKey: 'admin',
        secretKey: 'minioadmin',
        useSSL: false,
      },
    },
  ],
  MongoDB: [
    {
      name: 'mongodb',
      host: 'mongodb://localhost:27017/',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test',
      },
    },
  ],
  KafkaJSAdmin: [
    {
      name: 'admin',
      global: {
        brokers: ['localhost:9092'],
        clientId: 'test-app',
        logLevel: 1,
      },
    },
  ],
  Clickhouse: [
    {
      name: 'test',
      options: {},
    },
  ],
  Amqp: [
    {
      name: 'test',
      urls: ['amqp://localhost:5672'],
    },
  ],
  SchemaRegistry: [{ name: 'test', baseURL: 'http://localhost:8085' }],
  migrations: {
    directory: '/tests/migrations',
  },
});
