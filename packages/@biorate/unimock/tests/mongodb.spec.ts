import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, flushAllSnapshots, MODE_RECORD } from '../src';
import { MongoDBConnector } from './__mocks__/mongodb';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [MongoDBConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/mongodb', () => {
  it('mongodb connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      MongoDB: [
        {
          name: 'connection',
          host: 'mongodb://localhost:27017/',
          options: { dbName: 'test' },
        },
      ],
    });

    container.bind(MongoDBConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(MongoDBConnector) public connector: MongoDBConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const conn = root.connector.current!;
    // TODO: type fix
    const col = await (conn as any).collection('unimock_test');
    await col.updateOne({ _id: 'unimock:key' }, { $set: { value: 'unimock-value' } }, { upsert: true });
    const doc = await col.findOne({ _id: 'unimock:key' });
    expect(doc?.value).toBe('unimock-value');

    if (SnapshotStore.mode === MODE_RECORD) flushAllSnapshots();
    container.unbind(Root);
  });
});
