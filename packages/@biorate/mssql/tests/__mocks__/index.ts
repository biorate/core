import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MssqlConnector, IMssqlConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(MssqlConnector) public connector: IMssqlConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMssqlConnector>(MssqlConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Mssql: [
    {
      name: 'connection',
      options: {
        server: 'localhost',
        user: 'sa',
        password: 'admin_007',
        database: 'master',
        options: {
          trustServerCertificate: true,
        },
      },
    },
  ],
});

export const root: Root = container.get<Root>(Root);
