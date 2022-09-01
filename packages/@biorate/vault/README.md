# Vault

Vault connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { VaultConnector } from '@biorate/vault';

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

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.write('secret/data/test.json', {
    data: { hello: 'world' },
  });
  const result = await root.connector.current!.read('secret/data/test.json');
  console.log(result.data.data); // { hello: 'world' }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
