import { promises as fs } from 'fs';
import { inject, Types } from '@biorate/inversion';
import { Migration } from './migration';
import {
  ISequelizeConnector,
  ISequelizeConfig,
  ISequelizeConnection,
  DataType,
} from '@biorate/sequelize';
/**
 * @description Sequelize migration class
 */
export class Sequelize extends Migration {
  @inject(Types.Sequelize) protected connector: ISequelizeConnector;
  /**
   * @description Sequelize process method realization
   */
  protected async process() {
    await this.forEach<ISequelizeConfig, ISequelizeConnection>(
      'Sequelize',
      async (config, connection, paths) => {
        const model = connection.define(
          this.config.get<string>('migrations.tableName', 'migrations'),
          {
            name: {
              type: DataType.CHAR,
              primaryKey: true,
            },
          },
          { timestamps: false },
        );
        await model.sync({});
        await this.forEachPath(
          paths,
          async (file, name) =>
            await connection.transaction(async () => {
              const item = await model.findOne({ where: { name } });
              if (item) return;
              await connection.query(await fs.readFile(file, 'utf8'));
              await model.create({ name });
              this.log(config.name, name);
            }),
        );
      },
    );
  }
}
