import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore, flushAllSnapshots } from '../src';
import { MssqlConnector } from './__mocks__/mssql';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [MssqlConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/mssql', () => {
  it('mssql connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      Mssql: [
        {
          name: 'connection',
          options: {
            server: 'localhost',
            user: 'sa',
            password: 'admin_007',
            database: 'master',
            options: { trustServerCertificate: true },
          },
        },
      ],
    });

    container.bind(MssqlConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(MssqlConnector) public connector: MssqlConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const result = await root.connector.current!.query('SELECT 1 AS result');
    // TODO: type fix
    expect((result.recordsets as any)[0][0].result).toBe(1);

    flushAllSnapshots();
    container.unbind(Root);
  });
});
