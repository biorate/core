# Vault config loader

Vault config loader

### Features

- Merge json data into config 
- Download files from vault

### Examples

##### ./vault.ts
```
import { init } from '@biorate/inversion';
import { VaultConnector as VaultConnectorBase } from '@biorate/vault';

export class VaultConnector extends VaultConnectorBase {
  @init() protected async initialize() {
    await super.initialize();
    await this.current!.write('secret/data/config.json', {
      data: { hello: 'world! (merge)' },
    });
    await this.current!.write('secret/data/files.json', {
      data: { 'hello.txt': 'world! (download)' },
    });
  }
}
```

##### ./index.ts
```
import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IVaultConnector } from '@biorate/vault';
import { VaultConnector } from './vault';
import { ConfigLoader } from '@biorate/config-loader';
import { ConfigLoaderVault } from '@biorate/config-loader-vault';

class Root extends Core() {
  @inject(Types.Config) public config: IConfig;
  @inject(Types.Vault) public vault: IVaultConnector;
  @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoader;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<IVaultConnector>(Types.Vault)
  .to(VaultConnector)
  .inSingletonScope();
container.bind<ConfigLoader>(Types.ConfigLoaderVault).to(ConfigLoaderVault).inSingletonScope();
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
      path: 'secret/data/config.json',
      connection: 'connection',
      cache: true,
    },
    {
      action: 'download',
      path: 'secret/data/files.json',
      connection: 'connection',
      cache: true,
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  console.log(root.config.get('hello')); // world! (merge)

  const file = await fs.readFile(
    path.create(process.cwd(), 'keys', 'hello.txt'),
    'utf-8',
  )
  console.log(file); // world! (download)
})();
```

### See

[@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/config_loader_vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/config-loader-vault/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
