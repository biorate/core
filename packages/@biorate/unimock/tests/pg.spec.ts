import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SnapshotStore } from '../src';
import { PgConnector } from './__mocks__/pg';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [PgConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/pg', () => {
  it('pg connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      Pg: [
        {
          name: 'connection',
          options: {
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'postgres',
            port: 5432,
          },
        },
      ],
    });

    container.bind(PgConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(PgConnector) public connector: PgConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const result = await root.connector.current!.query('SELECT 1 AS result');
    if (SnapshotStore.mode !== 'replay') {
      expect(result.rows[0].result).toBe(1);
    }

    container.unbind(Root);
  });
});
