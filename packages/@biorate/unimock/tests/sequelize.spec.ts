import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  SequelizeConnector as RawSequelizeConnector,
  ISequelizeConnector,
} from '@biorate/sequelize';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../src';

@Mockable({})
class SequelizeConnector extends RawSequelizeConnector {
  protected readonly models = { connection: [] };
}

describe('@biorate/sequelize', () => {
  beforeAll(() => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  });

  afterAll(() => {
    [SequelizeConnector].forEach((c) => {
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
      Sequelize: [
        {
          name: 'connection',
          options: {
            logging: false,
            dialect: 'sqlite',
            storage: ':memory:',
          },
        },
      ],
    });

    container.bind(SequelizeConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(SequelizeConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const result = await root.connector.query<{ result: number }>('SELECT 1 AS result');
    expect(result[0].result).toBe(1);

    flushAllSnapshots();

    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    if (container.isBound(SequelizeConnector)) container.unbind(SequelizeConnector);
    container.bind(SequelizeConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(SequelizeConnector) public connector: ISequelizeConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const result = await root.connector.query<{ result: number }>('SELECT 1 AS result');
    expect(result[0].result).toBe(1);
  });
});
