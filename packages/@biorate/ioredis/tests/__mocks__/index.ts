import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(IORedisConnector) public connector: IORedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IORedisConnector>(IORedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  IORedis: [
    {
      name: 'connection',
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  ],
});

export const root: Root = container.get<Root>(Root);
