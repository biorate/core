import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IBatcher, Batcher } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Batcher) public batcher: IBatcher<{ data: string }, { test: string }>;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IBatcher<{ data: string }, { test: string }>>(Types.Batcher)
  .to(Batcher<{ data: string }, { test: string }>)
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({});

export const root = <Root>container.get<Root>(Root);
