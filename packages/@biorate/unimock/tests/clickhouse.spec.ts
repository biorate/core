import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, flushAllSnapshots, MODE_RECORD } from '../src';
import { ClickhouseConnector } from './__mocks__/clickhouse';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [ClickhouseConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/clickhouse', () => {
  it('clickhouse connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      Clickhouse: [{ name: 'connection', options: {} }],
    });

    container.bind(ClickhouseConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(ClickhouseConnector) public connector: ClickhouseConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const cursor = await root.connector.get().query({
      query: 'SELECT 1 AS result;',
      format: 'JSON',
    });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toBe(1);

    if (SnapshotStore.mode === MODE_RECORD) flushAllSnapshots();
    container.unbind(Root);
  });
});
