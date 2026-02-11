import { tmpdir } from 'os';
import { join } from 'path';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SequelizeConnector as BaseSequelizeConnector,
  ISequelizeConnector,
} from '../../src';
import { TestModel } from './models';

export * from './models';

export const name = 'connection';

class SequelizeConnector extends BaseSequelizeConnector {
  protected readonly models = { [name]: [TestModel] };
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

export const root = container.get<Root>(Root);
