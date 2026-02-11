import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { PgConnector, IPgConnector } from '../../src';

export class Root extends Core() {
  @inject(PgConnector) public connector: IPgConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IPgConnector>(PgConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

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

export const root: Root = container.get<Root>(Root);
