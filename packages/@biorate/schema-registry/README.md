# @biorate/schema-registry

Schema Registry connector — wraps the Confluent Schema Registry REST API for Avro schema management.

## Features

- **Auto-connect** — creates HTTP client on `@init()` via config namespace `SchemaRegistry`.
- **CRUD for subjects** — register, save, query schemas and subjects.
- **Compatibility check** — test schema compatibility against a subject.
- **Typed errors** — `SchemaRegistryCantConnectError`, `SchemaRegistryRequestError`.
- **Axios-based** — configurable HTTP client with auth and TLS.

## Installation

```bash
pnpm add @biorate/schema-registry
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/axios`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SchemaRegistryConnector } from '@biorate/schema-registry';

class Root extends Core() {
  @inject(SchemaRegistryConnector) public connector: SchemaRegistryConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<SchemaRegistryConnector>(SchemaRegistryConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  SchemaRegistry: [{
    name: 'connection',
    options: { baseURL: 'http://localhost:8081' },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  console.log(await root.connector.current!.subjects()); // ['test-value', ...]
})();
```

## API Reference

### `SchemaRegistryConnector`

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'SchemaRegistry'`                        | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<AxiosInstance>`     | Creates an Axios instance for the API.   |

### Connection methods (via `axios`)

The connection is an `AxiosInstance` configured with `baseURL` from config. Use its `.get()`, `.post()`, `.put()`, `.delete()` for Schema Registry endpoints:

| Endpoint                     | Method    | Description                |
|------------------------------|-----------|----------------------------|
| `/subjects`                  | GET       | List all subjects.         |
| `/subjects/:subject/versions`| GET       | List versions.             |
| `/subjects/:subject/versions/:version` | GET | Fetch schema.    |
| `/subjects/:subject`         | POST      | Register new schema.       |
| `/compatibility/subjects/:subject/versions/:version` | POST | Check compatibility. |

### Config

```ts
interface ISchemaRegistryConfig extends IConnectorConfig {
  options: AxiosRequestConfig;  // baseURL, headers, auth, httpsAgent, etc.
}
```

### Errors

| Error                              | Condition                                    |
|------------------------------------|----------------------------------------------|
| `SchemaRegistryCantConnectError`   | Axios instance creation fails.              |
| `SchemaRegistryRequestError`       | API response indicates failure.             |

## Architecture

```
SchemaRegistryConnector extends Connector<ISchemaRegistryConfig, AxiosInstance>
│
├── namespace = 'SchemaRegistry'
├── connect(config) → axios.create(config.options)
└── connection is an AxiosInstance
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/schema_registry.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/LICENSE)
