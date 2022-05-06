import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { Migrations } from './migrations';
import { ISequelizeConnector, ISequelizeConfig, DataType } from '@biorate/sequelize';
import { inject, Types } from '@biorate/inversion';

export class Sequelize extends Migrations {
  @inject(Types.Sequelize) protected sequelize: ISequelizeConnector;

  protected async process() {
    for (const config of this.config.get<ISequelizeConfig[]>(
      'Sequelize',
      [],
    )) {
      const paths = await this.scan(config.name);
      if (!paths.length) continue;
      const connection = this.sequelize.connection(config.name);
      const model = connection.define(
        'migrations',
        {
          name: {
            type: DataType.CHAR,
            unique: true,
            primaryKey: true,
          },
        },
        { timestamps: false },
      );
      await model.sync({});
      for (const p of paths) {
        const name = path.basename(p);
        await connection.transaction(async () => {
          const item = await model.findOne({ where: { name } });
          if (item) return;
          await connection.query(await fs.readFile(p, 'utf8'));
          await model.create({ name });
          this.log(config.name, name);
        });
      }
    }
  }
}
