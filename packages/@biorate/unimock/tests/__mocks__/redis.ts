import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RedisConnector as RawRedisConnector } from '@biorate/redis';
import { Mockable } from '../../src';

@Mockable({})
export class RedisConnector extends RawRedisConnector {}

class Root extends Core() {
  @inject(RedisConnector) public connector: RedisConnector;
}

const config = {
  Redis: [
    {
      name: 'connection',
      options: { url: 'redis://localhost:6379' },
    },
  ],
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(RedisConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: RedisConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(RedisConnector)) container.unbind(RedisConnector);
}
