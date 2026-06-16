import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, flushAllSnapshots, MODE_RECORD } from '../src';
import { RedisConnector } from './__mocks__/redis';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [RedisConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/redis', () => {
  it('redis connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      Redis: [
        {
          name: 'connection',
          options: { url: 'redis://localhost:6379' },
        },
      ],
    });

    container.bind(RedisConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(RedisConnector) public connector: RedisConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const conn = root.connector.current!;
    await conn.set('unimock:key', 'unimock-value');
    const value = await conn.get('unimock:key');
    expect(value).toBe('unimock-value');

    if (SnapshotStore.mode === MODE_RECORD) flushAllSnapshots();
    container.unbind(Root);
  });
});
