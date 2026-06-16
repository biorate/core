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
  [IORedisConnector].forEach((c) => {
    try {
      if (container.isBound(c)) container.unbind(c);
    } catch {
      /* ok */
    }
  });
});

describe('@biorate/ioredis', () => {
  it('record', async () => {
    SnapshotStore.setMode('record');

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

    await root.connector.current!.set('unimock:key', 'unimock-value');
    const value = await root.connector.current!.get('unimock:key');
    expect(value).toBe('unimock-value');

    flushAllSnapshots();
    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    if (container.isBound(IORedisConnector)) container.unbind(IORedisConnector);
    container.bind(IORedisConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(IORedisConnector) public connector: IORedisConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const value = await root.connector.current!.get('unimock:key');
    expect(value).toBe('unimock-value');
  });
});
