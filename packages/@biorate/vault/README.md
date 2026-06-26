# @biorate/vault

Vault connector — wraps the HashiCorp Vault HTTP API for secrets management, authentication, and related entities.

## Features

- **Auto-connect** — creates an Axios-based Vault API client on `@init()` via config namespace `Vault`.
- **Secrets API** — read, write, list, delete secrets at a path.
- **Auth API** — token-based authentication (login, lookup, renew, revoke).
- **Related entities** — wraps multiple sub-APIs: `alembic`, `cubbyhole`, `database`, `identity`, `ldap`, `pki`, `rabbitmq`, `totp`, `transit`.
- **Typed errors** — `VaultCantConnectError`, `VaultRequestError`.
- **Configurable HTTP client** — baseURL, token, auth, TLS via Axios.

## Installation

```bash
pnpm add @biorate/vault
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/axios`.

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
  Vault: [{
    name: 'connection',
    options: {
      baseURL: 'http://localhost:8200',
      token: 'root-token',
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.secrets.write('secret/data/test', { data: { foo: 'bar' } });
  const data = await root.connector.current!.secrets.read('secret/data/test');
  console.log(data.data.data); // { foo: 'bar' }
  await root.connector.current!.secrets.delete('secret/data/test');
})();
```

## API Reference

### `VaultConnector`

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'Vault'`                                 | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IVaultConnection>`   | Creates Axios instance for Vault API.    |

### Connection sub-APIs

The connection exposes these API groups:

| Property     | Methods                                           | Description            |
|--------------|---------------------------------------------------|------------------------|
| `secrets`    | `read`, `write`, `list`, `delete`                 | KV Secrets Engine.     |
| `auth`       | `login`, `lookup`, `renew`, `revoke`              | Token auth.            |
| `alembic`    | `configure`, `status`, `rollback` (DB migrations) | (if configured)        |
| `cubbyhole`  | `read`, `write`, `list`, `delete`                 | Cubbyhole secrets.     |
| `database`   | `configure`, `creds`, `rotate`                    | Database secrets.      |
| `identity`   | CRUD for entities/groups/aliases                  | Identity engine.       |
| `ldap`       | `login`, `configure`, `groups`, `users`           | LDAP auth.             |
| `pki`        | `issue`, `sign`, `revoke`, `crl`, `configure`     | PKI engine.            |
| `rabbitmq`   | `configure`, `creds`                              | RabbitMQ secrets.      |
| `totp`       | `generate`, `validate`, `configure`               | TOTP engine.           |
| `transit`    | `encrypt`, `decrypt`, `sign`, `verify`            | Transit engine.        |

### Config

```ts
interface IVaultConfig extends IConnectorConfig {
  options: IVaultConfigOptions;
}

interface IVaultConfigOptions {
  baseURL: string;     // http://vault:8200
  token?: string;       // static Vault token
  auth?: AxiosRequestConfig['auth']; // basic auth
  httpsAgent?: any;     // TLS agent
}
```

### Errors

| Error                    | Condition                                    |
|--------------------------|----------------------------------------------|
| `VaultCantConnectError`  | Axios instance creation fails.               |
| `VaultRequestError`      | API response indicates failure.              |

## Architecture

```
VaultConnector extends Connector<IVaultConfig, IVaultConnection>
│
├── namespace = 'Vault'
├── connect(config) → new VaultClient(config)
│
├── VaultClient
│   ├── raw: AxiosInstance (baseURL + token/headers)
│   ├── secrets.read/write/list/delete
│   ├── auth.login/lookup/renew/revoke
│   ├── cubbyhole.read/write/list/delete
│   ├── database.configure/creds/rotate
│   ├── identity.*
│   ├── ldap.login/configure/groups/users
│   ├── pki.issue/sign/revoke/crl/configure
│   ├── rabbitmq.configure/creds
│   ├── totp.generate/validate/configure
│   ├── transit.encrypt/decrypt/sign/verify
│   └── alembic.configure/status/rollback
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/vault.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/vault/LICENSE)
