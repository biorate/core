import { tmpdir } from 'os';
import { join } from 'path';
import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SequelizeConnector as BaseSequelizeConnector,
  ISequelizeConnector,
} from '../../src';
import { TestModel } from './models';

export * from './models';

use(jestSnapshotPlugin());

export const name = 'connection';

class SequelizeConnector extends BaseSequelizeConnector {
  protected models = { [name]: [TestModel] };
}

export class Root extends Core() {
  @inject(SequelizeConnector) public connector: ISequelizeConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ISequelizeConnector>(SequelizeConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name,
      options: {
        logging: false,
        dialect: 'sqlite',
        storage: join(tmpdir(), 'sqlite-test.db'),
      },
    },
  ],
});
