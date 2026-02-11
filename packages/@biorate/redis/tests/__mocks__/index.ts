import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RedisConnector } from '../../src';

export class Root extends Core() {
  @inject(RedisConnector) public connector: RedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RedisConnector>(RedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Redis: [
    {
      name: 'connection',
      options: {
        url: 'redis://localhost:6379',
      },
    },
  ],
});

export const root: Root = container.get<Root>(Root);
