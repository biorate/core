import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { VaultConnector, IVaultConnector } from '../../src';

export class Root extends Core() {
  @inject(Types.VaultConnector) public connector: IVaultConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IVaultConnector>(Types.VaultConnector)
  .to(VaultConnector)
  .inSingletonScope();
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

export const root = container.get<Root>(Root);
