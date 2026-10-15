# @biorate/schema-registry

Schema Registry connector — wraps the Confluent Schema Registry REST API for Avro schema management.

## Features

- **Auto-connect** — creates the API client on `@init()` via the config namespace `SchemaRegistry`.
- **Typed endpoint client** — a custom API object with dedicated methods per Schema Registry endpoint (`getSubjects`, `postSubjects`, `putConfig`, `encode`, `decode`, ...), not a raw `AxiosInstance`.
- **Avro encode / decode** — binary serialisation helpers that read schema from the registry.
- **Typed errors** — `SchemaRegistryCantConnectError`, `SchemaRegistryAvroSchemaParseError`.

## Installation

```bash
pnpm add @biorate/schema-registry
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/axios-prometheus`.

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
  SchemaRegistry: [
    {
      name: 'connection',
      baseURL: 'http://localhost:8081',
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  const { getSubjects, postSubjectsVersions } = root.connector.connection('connection');
  console.log(await getSubjects()); // ['test-value', ...]
  console.log(await postSubjectsVersions({ subject: 'test-value', schema: { ... } })); // { id: 1 }
})();
```

## API Reference

### `SchemaRegistryConnector`

| Member            | Type                                             | Description                                                                                    |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `namespace`       | `'SchemaRegistry'`                               | Config key for connection definitions.                                                         |
| `connect(config)` | `(config) => Promise<ISchemaRegistryConnection>` | Creates the API client and calls `ping()`; throws `SchemaRegistryCantConnectError` on failure. |

### Connection methods

`connection(name?)` returns the API object created by `create(config)` — a namespace of bound endpoint methods. Each endpoint returns an `AxiosResponse` whose `.data` carries the payload.

| Method                                                                           | Endpoint                                      | HTTP   | `data` shape                                                                     |
| -------------------------------------------------------------------------------- | --------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `ping()`                                                                         | `/`                                           | GET    | `Record<string, unknown>`                                                        |
| `getSubjects()`                                                                  | `/subjects`                                   | GET    | `string[]`                                                                       |
| `postSubjects({ subject, schema, schemaType?, reference?, normalize? })`         | `/subjects/:subject`                          | POST   | `{ subject, id, version, schema }`                                               |
| `postSubjectsVersions({ subject, schema, schemaType?, reference?, normalize? })` | `/subjects/:subject/versions`                 | POST   | `{ id }`                                                                         |
| `getSubjectsVersions(subject)`                                                   | `/subjects/:subject/versions`                 | GET    | `number[]`                                                                       |
| `getSubjectsByVersion({ subject, version })`                                     | `/subjects/:subject/versions/:version`        | GET    | `{ subject, id, version, schemaType, schema }`                                   |
| `getSchemaBySubjectsAndVersion({ subject, version })`                            | `/subjects/:subject/versions/:version/schema` | GET    | `unknown`                                                                        |
| `getSchemasById(id)`                                                             | `/schemas/ids/:id`                            | GET    | `{ schema }`                                                                     |
| `getSchemasVersionsById(id)`                                                     | `/schemas/ids/:id/versions`                   | GET    | `{ subject, version }[]`                                                         |
| `getSchemasTypes()`                                                              | `/schemas/types`                              | GET    | `string[]`                                                                       |
| `deleteSubjects({ subject, permanent? })`                                        | `/subjects/:subject`                          | DELETE | `number[]`                                                                       |
| `putConfig({ subject, compatibility })`                                          | `/config/:subject`                            | PUT    | `{ compatibility }`                                                              |
| `encode(subject, data, version?)`                                                | —                                             | —      | `Buffer` (validates against schema; throws `SchemaRegistryAvroSchemaParseError`) |
| `decode(buffer)`                                                                 | —                                             | —      | decoded Avro value                                                               |

`compatibility` is one of `ICompatibilities`: `BACKWARD`, `BACKWARD_TRANSITIVE`, `FORWARD`, `FORWARD_TRANSITIVE`, `FULL`, `FULL_TRANSITIVE`, `NONE`.

### Config

```ts
interface ISchemaRegistryConfig extends IConnectorConfig {
  baseURL: string;
  headers?: Record<string, string>;
}
```

There is no `options` object — `baseURL` and `headers` sit at the top level of each connection definition.

### Errors

| Error                                | Condition                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `SchemaRegistryCantConnectError`     | `connect()` fails (the `ping()` request to the registry fails).                                     |
| `SchemaRegistryAvroSchemaParseError` | `encode()` validation fails — the payload does not match the registered schema (HTTP status `400`). |

## Architecture

```
SchemaRegistryConnector extends Connector<ISchemaRegistryConfig, ISchemaRegistryConnection>
│
├── namespace = 'SchemaRegistry'
├── connect(config) → create(config)  // builds the endpoint client from api.ts
│   └── await connection.ping()       // throws SchemaRegistryCantConnectError on failure
│
└── connection is the API object: { ping, getSubjects, postSubjects, ..., encode, decode }
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/schema_registry.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/schema-registry/LICENSE)
