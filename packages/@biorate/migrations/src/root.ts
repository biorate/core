import { init, injectable, inject, Types, Core } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { IVaultConnector } from '@biorate/vault';
import { IProxyConnector } from '@biorate/proxy';
import * as Migrations from './types';

@injectable()
export class Root extends Core() {
  @inject(Types.Config) public readonly config: IConfig;

  @inject(Types.ConfigLoaderEnv) public readonly configLoaderEnv: ConfigLoader;

  @inject(Types.ConfigLoaderFs) public readonly configLoaderFs: ConfigLoader;

  @inject(Types.ConfigLoaderVault) public readonly configLoaderVault: ConfigLoader;

  @inject(Types.Vault) public readonly vault: IVaultConnector;

  @inject(Types.Proxy) public readonly proxy: IProxyConnector;

  @inject(Migrations.Sequelize) public readonly sequelize: Migrations.Sequelize;

  @inject(Migrations.Minio) public readonly minio: Migrations.Minio;

  @inject(Migrations.Mongodb) public readonly mongodb: Migrations.Mongodb;

  @inject(Migrations.Kafka) public readonly kafkaJSAdmin: Migrations.Kafka;

  @inject(Migrations.Clickhouse) public readonly clickhouse: Migrations.Clickhouse;

  @inject(Migrations.Amqp) public readonly amqp: Migrations.Amqp;

  @inject(Migrations.SchemaRegistry)
  public readonly schemaRegistry: Migrations.SchemaRegistry;

  @init() protected async initialize() {
    process.exit();
  }
}

// @ts-ignore
Core.log = null;
