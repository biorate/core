import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MssqlConnector as RawMssqlConnector } from '@biorate/mssql';
import { Mockable } from '../../src';

@Mockable({})
export class MssqlConnector extends RawMssqlConnector {}

class Root extends Core() {
  @inject(MssqlConnector) public connector: MssqlConnector;
}

const config = {
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
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(MssqlConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: MssqlConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(MssqlConnector)) container.unbind(MssqlConnector);
}
