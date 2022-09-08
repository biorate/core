import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderFs } from '../../src';

use(jestSnapshotPlugin());

export const key = 'test';
export const value = 'Hello world!';

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderFs)
  .to(ConfigLoaderFs.root(__dirname))
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({});

export const root = container.get<Root>(Root);
