import { IConfig } from '@biorate/config';
import { init, injectable, inject, Types, Core } from '@biorate/inversion';
import * as Migrations from './types';

@injectable()
export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Migrations.Sequelize) public sequelize: Migrations.Sequelize;
  @inject(Migrations.Minio) protected minio: Migrations.Minio;
  @inject(Migrations.Mongodb) protected mongodb: Migrations.Mongodb;

  @init() protected async initialize() {
    process.exit();
  }
}

// @ts-ignore
Core.log = null;
