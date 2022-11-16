import { container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '@biorate/config-loader-env';
import { ConfigLoaderFs } from '@biorate/config-loader-fs';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';
import { VaultConnector, IVaultConnector } from '@biorate/vault';
import { ISequelizeConnection, SequelizeConnector } from '@biorate/sequelize';
import { IMinioConnection, MinioConnector } from '@biorate/minio';
import { IMongoDBConnection, MongoDBConnector } from '@biorate/mongodb';
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
  .bind<ISequelizeConnection>(Types.Sequelize)
  .to(SequelizeConnector)
  .inSingletonScope();
container.bind<IMinioConnection>(Types.Minio).to(MinioConnector).inSingletonScope();
container.bind<IMongoDBConnection>(Types.Mongodb).to(MongoDBConnector).inSingletonScope();
container.bind<Migrations.Sequelize>(Migrations.Sequelize).toSelf().inSingletonScope();
container.bind<Migrations.Minio>(Migrations.Minio).toSelf().inSingletonScope();
container.bind<Migrations.Mongodb>(Migrations.Mongodb).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
container.get<Root>(Root).$run().catch(console.error);
