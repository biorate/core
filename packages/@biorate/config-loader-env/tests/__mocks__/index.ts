import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoaderEnv } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoader) public configLoaderEnv: ConfigLoaderEnv;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ConfigLoaderEnv>(Types.ConfigLoader)
  .to(ConfigLoaderEnv)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({});

export const root = container.get<Root>(Root);
