import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { PgConnector as RawPgConnector } from '@biorate/pg';
import { Mockable } from '../../src';

@Mockable({})
export class PgConnector extends RawPgConnector {}

class Root extends Core() {
  @inject(PgConnector) public connector: PgConnector;
}

const config = {
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
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(PgConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: PgConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(PgConnector)) container.unbind(PgConnector);
}
