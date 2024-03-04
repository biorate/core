import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';
import { IVaultConnector, VaultConnector } from '@biorate/vault';
import { ISequelizeConnector, SequelizeConnector } from '@biorate/sequelize';
import { IMinioConnector, MinioConnector } from '@biorate/minio';
import { IMongoDBConnector, MongoDBConnector } from '@biorate/mongodb';
import { IClickhouseConnector, ClickhouseConnector } from '@biorate/clickhouse';
import { IAmqpConnector, AmqpConnector } from '@biorate/amqp';
import { IKafkaJSAdminConnector, KafkaJSAdminConnector } from '@biorate/kafkajs';
import { Root } from './';
import * as Migrations from './types';

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
container.bind<Migrations.Sequelize>(Migrations.Sequelize).toSelf().inSingletonScope();
container.bind<Migrations.Minio>(Migrations.Minio).toSelf().inSingletonScope();
container.bind<Migrations.Mongodb>(Migrations.Mongodb).toSelf().inSingletonScope();
container.bind<Migrations.Kafka>(Migrations.Kafka).toSelf().inSingletonScope();
container.bind<Migrations.Clickhouse>(Migrations.Clickhouse).toSelf().inSingletonScope();
container.bind<Migrations.Amqp>(Migrations.Amqp).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
container.get<Root>(Root).$run().catch(console.error);
