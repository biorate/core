import { IConfig } from '@biorate/config';
import { init, injectable, inject, Types, Core, container } from '@biorate/inversion';
import * as Migrations from './types';

@injectable()
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Migrations.Sequelize) public sequelize: Migrations.Sequelize;

  @init() protected async initialize() {
    process.exit();
  }
}

// @ts-ignore
Core.log = null;
