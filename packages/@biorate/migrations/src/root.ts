import { IConfig } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { IVaultConnector } from '@biorate/vault';
import { init, injectable, inject, Types, Core } from '@biorate/inversion';
import * as Migrations from './types';

@injectable()
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderEnv) public configLoaderEnv: ConfigLoader;
  @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;
  @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoader;
  @inject(Types.Vault) public vault: IVaultConnector;
  @inject(Migrations.Sequelize) public sequelize: Migrations.Sequelize;
  @inject(Migrations.Minio) protected minio: Migrations.Minio;
  @inject(Migrations.Mongodb) protected mongodb: Migrations.Mongodb;
  @inject(Migrations.Kafka) public kafkaJSAdmin: Migrations.Kafka;
  @inject(Migrations.Clickhouse) public clickhouse: Migrations.Clickhouse;

  @init() protected async initialize() {
    process.exit();
  }
}

// @ts-ignore
Core.log = null;
