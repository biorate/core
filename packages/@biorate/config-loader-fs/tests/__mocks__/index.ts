import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IConfigLoader } from '../../src';
import { ConfigLoader } from './config-loader';

use(jestSnapshotPlugin());

export const key = 'test';
export const value = 'Hello world!';

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.ConfigLoader) public configLoader: IConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IConfigLoader>(Types.ConfigLoader).to(ConfigLoader).inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({});

export const root = container.get<Root>(Root);
