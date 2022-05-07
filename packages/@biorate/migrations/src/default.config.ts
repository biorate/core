import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { FileConfig } from '@biorate/file-config';
import { ISequelizeConnection, SequelizeConnector } from '@biorate/sequelize';
import { Root } from './';
import * as Migrations from './types';

container.bind<IConfig>(Types.Config).to(FileConfig).inSingletonScope();
container
  .bind<ISequelizeConnection>(Types.Sequelize)
  .to(SequelizeConnector)
  .inSingletonScope();
container.bind<Migrations.Sequelize>(Migrations.Sequelize).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
container.get<Root>(Root).$run().catch(console.error);
