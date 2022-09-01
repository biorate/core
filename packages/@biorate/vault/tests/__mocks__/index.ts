import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { VaultConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(VaultConnector) public connector: VaultConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<VaultConnector>(VaultConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Vault: [
    {
      name: 'connection',
      options: {
        apiVersion: 'v1',
        endpoint: 'http://localhost:8200',
        token: 'admin',
      },
    },
  ],
});
