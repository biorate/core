import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { FileConfig } from '@biorate/file-config';
import { ISequelizeConnection, SequelizeConnector } from '@biorate/sequelize';
import { IMinioConnection, MinioConnector } from '@biorate/minio';
import { IMongoDBConnection, MongoDBConnector } from '@biorate/mongodb';
import { Root } from './';
import * as Migrations from './types';

container.bind<IConfig>(Types.Config).to(FileConfig).inSingletonScope();
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
