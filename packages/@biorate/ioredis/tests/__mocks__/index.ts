import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector } from '../../src';

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
        reconnectTimes: -1,
        reconnectTimeoutDelta: 1000,
        reconnectTimeoutLimit: 1000,
      },
    },
  ],
});

export const root: Root = container.get<Root>(Root);
