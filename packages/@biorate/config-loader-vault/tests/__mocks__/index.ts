import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IVaultConnector } from '@biorate/vault';
import { ConfigLoader } from '@biorate/config-loader';
import { VaultConnector } from './vault';
import { ConfigLoaderVault } from '../../src';

use(jestSnapshotPlugin());

export const paths = {
  config: 'secret/data/config.json',
  files: 'secret/data/files.json',
  notExists: 'secret/data/not-exists.json',
};

export const data = {
  config: { hello: 'world!' },
  files: { 'hello.txt': 'world!' },
};

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Vault) public vault: IVaultConnector;
  @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoaderVault;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IVaultConnector>(Types.Vault).to(VaultConnector).inSingletonScope();
container
  .bind<ConfigLoader>(Types.ConfigLoaderVault)
  .to(ConfigLoaderVault)
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
  ConfigLoaderVault: [
    {
      action: 'merge',
      path: paths.config,
      connection: 'connection',
      cache: true,
    },
    {
      action: 'download',
      path: paths.files,
      connection: 'connection',
      cache: true,
    },
    {
      action: 'download',
      path: paths.notExists,
      connection: 'connection',
      cache: true,
      required: false,
    },
  ],
});

export const root: Root = container.get<Root>(Root);
