import { EventEmitter } from 'events';
import { init, injectable, inject, Types, Core, container } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { IVaultConnector, VaultConnector } from '@biorate/vault';
import { IProxyConnector, ProxyConnector } from '@biorate/proxy';
import * as Migrations from './types';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';
import { ISequelizeConnector, SequelizeConnector } from '@biorate/sequelize';
import { IMinioConnector, MinioConnector } from '@biorate/minio';
import { IMongoDBConnector, MongoDBConnector } from '@biorate/mongodb';
import { ClickhouseConnector, IClickhouseConnector } from '@biorate/clickhouse';
import { AmqpConnector, IAmqpConnector } from '@biorate/amqp';
import { IKafkaJSAdminConnector, KafkaJSAdminConnector } from '@biorate/kafkajs';
import {
  ISchemaRegistryConnector,
  SchemaRegistryConnector,
} from '@biorate/schema-registry';

@injectable()
export class Root extends Core(EventEmitter) {
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
    process.exit(0);
  }
}

// @ts-ignore
Core.log = null;

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderEnv)
  .to(ConfigLoaderEnv)
  .inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderVault)
  .to(ConfigLoaderVault)
  .inSingletonScope();
container.bind<IVaultConnector>(Types.Vault).to(VaultConnector).inSingletonScope();
container
  .bind<ISequelizeConnector>(Types.Sequelize)
  .to(SequelizeConnector)
  .inSingletonScope();
container.bind<IMinioConnector>(Types.Minio).to(MinioConnector).inSingletonScope();
container.bind<IMongoDBConnector>(Types.Mongodb).to(MongoDBConnector).inSingletonScope();
container
  .bind<IClickhouseConnector>(Types.Clickhouse)
  .to(ClickhouseConnector)
  .inSingletonScope();
container.bind<IAmqpConnector>(Types.Amqp).to(AmqpConnector).inSingletonScope();
container
  .bind<IKafkaJSAdminConnector>(Types.Kafka)
  .to(KafkaJSAdminConnector)
  .inSingletonScope();
container.bind<IProxyConnector>(Types.Proxy).to(ProxyConnector).inSingletonScope();
container
  .bind<ISchemaRegistryConnector>(Types.SchemaRegistry)
  .to(SchemaRegistryConnector)
  .inSingletonScope();
container.bind<Migrations.Sequelize>(Migrations.Sequelize).toSelf().inSingletonScope();
container.bind<Migrations.Minio>(Migrations.Minio).toSelf().inSingletonScope();
container.bind<Migrations.Mongodb>(Migrations.Mongodb).toSelf().inSingletonScope();
container.bind<Migrations.Kafka>(Migrations.Kafka).toSelf().inSingletonScope();
container.bind<Migrations.Clickhouse>(Migrations.Clickhouse).toSelf().inSingletonScope();
container.bind<Migrations.Amqp>(Migrations.Amqp).toSelf().inSingletonScope();
container
  .bind<Migrations.SchemaRegistry>(Migrations.SchemaRegistry)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).to(Root).inSingletonScope();
