import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ClickhouseConnector as ChConnector } from '@biorate/clickhouse';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../src';

// const snapshotDir = '/tmp/unimock-test/clickhouse';

@Mockable({})
class ClickhouseConnector extends ChConnector {}

describe('@biorate/clickhouse', () => {
  beforeAll(() => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  });

  afterAll(() => {
    [ClickhouseConnector].forEach((c) => {
      try {
        if (container.isBound(c)) container.unbind(c);
      } catch {
        /* ok */
      }
    });
  });

  it('record', async () => {
    SnapshotStore.setMode('record');

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

    flushAllSnapshots();

    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    if (container.isBound(ClickhouseConnector)) container.unbind(ClickhouseConnector);
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
  });
});
