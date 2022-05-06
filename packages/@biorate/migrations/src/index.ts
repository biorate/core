import { IConfig } from '@biorate/config';
import { FileConfig } from '@biorate/file-config';
import { SequelizeConnector, ISequelizeConnection } from '@biorate/sequelize';
import * as Migrations from './migrations';
import { init, injectable, inject, Types, container, Core } from '@biorate/inversion';

Core.log = null;

@injectable()
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Sequelize) public sequelize: ISequelizeConnection;
  @inject(Migrations.Sequelize) public sequelizeMg: Migrations.Sequelize;

  @init() protected async initialize() {
    process.exit();
  }
}

container.bind<IConfig>(Types.Config).to(FileConfig).inSingletonScope();
container
  .bind<ISequelizeConnection>(Types.Sequelize)
  .to(SequelizeConnector)
  .inSingletonScope();
container.bind<Migrations.Sequelize>(Migrations.Sequelize).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();
