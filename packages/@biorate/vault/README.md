# @biorate/vault

Vault connector — wraps the `node-vault` client for HashiCorp Vault secrets management and authentication.

## Features

- **Auto-connect** — creates a `node-vault` client on `@init()` via config namespace `Vault`.
- **AppRole login** — `auth` performs an `approleLogin` and injects the resulting token.
- **Flat API** — the connection exposes `write`/`read`/`delete` plus the generated `node-vault` commands (e.g. `approleLogin`, `encryptData`, `tokenLookup`).
- **Typed errors** — `VaultCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/vault
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/errors`, `node-vault@0.10.9`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { VaultConnector } from '@biorate/vault';

class Root extends Core() {
  @inject(VaultConnector) public connector: VaultConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<VaultConnector>(VaultConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Vault: [
    {
      name: 'connection',
      auth: {
        type: 'approleLogin',
        responseTokenPath: 'auth.client_token',
        args: [{ role_id: 'role-id', secret_id: 'secret-id' }],
      },
      options: {
        apiVersion: 'v1',
        endpoint: 'http://localhost:8200',
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.write('secret/data/test', { data: { foo: 'bar' } });
  const data = await root.connector.current!.read('secret/data/test');
  console.log(data.data.data); // { foo: 'bar' }
  await root.connector.current!.delete('secret/data/test');
})();
```

## API Reference

### `VaultConnector`

| Member            | Type                                    | Description                            |
| ----------------- | --------------------------------------- | -------------------------------------- |
| `namespace`       | `'Vault'`                               | Config key for connection definitions. |
| `connect(config)` | `(config) => Promise<IVaultConnection>` | Creates the `node-vault` client.       |

The connection is a `node-vault` `client`. It exposes the flat `write`/`read`/`delete` methods, plus the commands generated from the `node-vault` API (e.g. `approleLogin`, `encryptData`, `tokenLookup`).

### Config

```ts
interface IVaultConfig extends IConnectorConfig {
  options: VaultOptions; // endpoint, apiVersion, namespace, token
  auth: IAuthType; // required; performs approleLogin
}

type IAuthType = {
  type: 'approleLogin';
  responseTokenPath: 'auth.client_token';
  args: [{ role_id: string; secret_id: string }];
};
```

The `options` object is built from `node-vault` options — the server address is the `endpoint` property, plus optional `apiVersion`, `namespace`, `token`.

### Errors

| Error                   | Condition                               |
| ----------------------- | --------------------------------------- |
| `VaultCantConnectError` | Client creation or AppRole login fails. |

## Architecture

```
VaultConnector extends Connector<IVaultConfig, IVaultConnection>
│
├── namespace = 'Vault'
├── connect(config)
│   ├── client = Client(pick(options, apiVersion, endpoint, namespace, token))
│   ├── if (auth) → client = Client({ token: approleLogin(...), ...options })
│   └── returns the node-vault client
└── connection exposes flat write / read / delete + generated commands
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/LICENSE)
