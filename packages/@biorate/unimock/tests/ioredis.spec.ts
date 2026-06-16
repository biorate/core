import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, flushAllSnapshots } from '../src';
import { IORedisConnector } from './__mocks__/ioredis';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [IORedisConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/ioredis', () => {
  it('ioredis connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      IORedis: [
        {
          name: 'connection',
          options: { host: 'localhost', port: 6379 },
        },
      ],
    });

    container.bind(IORedisConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(IORedisConnector) public connector: IORedisConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const conn = root.connector.current!;
    await conn.set('unimock:key', 'unimock-value');
    const value = await conn.get('unimock:key');
    expect(value).toBe('unimock-value');

    flushAllSnapshots();
    container.unbind(Root);
  });
});
