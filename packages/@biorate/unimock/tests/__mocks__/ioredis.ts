import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector as RawIORedisConnector } from '@biorate/ioredis';
import { Mockable } from '../../src';

@Mockable({})
export class IORedisConnector extends RawIORedisConnector {}

class Root extends Core() {
  @inject(IORedisConnector) public connector: IORedisConnector;
}

const config = {
  IORedis: [
    {
      name: 'connection',
      options: { host: 'localhost', port: 6379 },
    },
  ],
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(IORedisConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: IORedisConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(IORedisConnector)) container.unbind(IORedisConnector);
}
