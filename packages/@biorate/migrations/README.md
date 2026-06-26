# @biorate/migrations

Database and infrastructure migration framework — manages schema and data migrations across Sequelize, MongoDB, Minio, Kafka, Clickhouse, AMQP, and Schema Registry.

## Features

- **Multi-engine** — RDBMS (Sequelize), MongoDB, Minio/S3, Kafka Admin, Clickhouse, AMQP/RabbitMQ, Schema Registry.
- **Tracking** — tracks completed migrations per engine (Sequelize/MongoDB/Clickhouse store in a table/collection).
- **JavaScript/SQL** — JS scripts for complex logic, SQL files for schema DDL.
- **DI-orchestrated** — all connectors managed via `@biorate/inversion` container.
- **Side-effect import** — `@biorate/migrations` auto-runs when loaded (`node -r @biorate/migrations`).

## Installation

```bash
pnpm add @biorate/migrations
```

Requires the underlying engine packages (`@biorate/sequelize`, `@biorate/mongodb`, `@biorate/minio`, `@biorate/kafkajs`, `@biorate/clickhouse`, `@biorate/amqp`, `@biorate/schema-registry`, `@biorate/vault`).

## Quick start

```json
// package.json
{
  "scripts": {
    "migrations": "node -r @biorate/migrations"
  }
}
```

Run with environment config:

```bash
MIGRATIONS_CONFIG=./config.ts npm run migrations
```

## Module reference

### `Root` — Orchestrator

`Root` is the main DI class that initialises all migration connectors. Binds every connector into the `@biorate/inversion` container and calls `process.exit(0)` on completion.

```ts
import { Root } from '@biorate/migrations';

// Root is auto-instantiated on package import.
// Manually:
import { container } from '@biorate/inversion';
const root = container.get<Root>(Root);
await root.$run();
```

### `Migration` — Abstract base

```ts
import { Migration } from '@biorate/migrations';
```

Abstract base class for all migration types. Provides:

| Member             | Signature                                      | Description                                   |
|--------------------|------------------------------------------------|-----------------------------------------------|
| `config`           | `protected config: IConfig`                    | Injected config service.                      |
| `connector`        | `protected abstract connector: IConnector`     | Engine connector (must be overridden).        |
| `type`             | `protected get type(): string`                 | `this.constructor.name.toLowerCase()`.        |
| `scan(...args)`    | `async scan(...paths): Promise<string[]>`      | Scans migration directory, returns file paths.|
| `path(...args)`    | `path(...segments): string`                    | Builds path: `cwd/migrations/{type}/{...}`.   |
| `log(...args)`     | `log(...msg): void`                            | Console logging with type prefix.             |
| `forEach(namespace, callback)` | `async forEach<T, C>(ns, fn)` | Iterates config entries and connections.      |
| `forEachPath(paths, callback)`  | `async forEachPath(paths, fn)`   | Iterates files in a path list.                |
| `process()`        | `protected abstract process(): Promise<void>`  | Override with migration logic.                |
| `initialize()`     | `@init() protected async initialize()`         | Calls `this.process()` on lifecycle init.     |

### `Sequelize` — RDBMS migrations

```ts
import { Sequelize } from '@biorate/migrations';
```

Reads SQL files (e.g. `00001_create_users.sql`) from `migrations/sequelize/`, executes them in transactions, and tracks completion in a `migrations` table (`name CHAR PRIMARY KEY`).

**Config namespace:** `Sequelize` (from `@biorate/sequelize` base config).

**Directory:** `./migrations/sequelize/`

### `Mongodb` — MongoDB migrations

```ts
import { Mongodb } from '@biorate/migrations';
```

Loads and executes JS scripts (`module.exports = async (connection, config, globalConfig) => {...}`) from `migrations/mongodb/`. Tracks completed scripts via documents in a `migrations` collection.

**Config namespace:** `MongoDB` (from `@biorate/mongodb` base config).

**Directory:** `./migrations/mongodb/`

### `Minio` — Minio/S3 migrations

```ts
import { Minio } from '@biorate/migrations';
```

Loads and executes JS scripts (`module.exports = async (connection, config, globalConfig) => {...}`) from `migrations/minio/`. Tracks completed scripts via marker objects in a migrations bucket.

**Config namespace:** `Minio` (from `@biorate/minio` base config).

**Directory:** `./migrations/minio/`

### `Kafka` — Kafka Admin migrations

```ts
import { Kafka } from '@biorate/migrations';
```

Loads and executes JS scripts (`module.exports = async (connection, config, globalConfig) => {...}`) from `migrations/kafka/`. Creates/alters topics, configs, etc. **No tracking** (every run re-applies).

**Config namespace:** `KafkaJSAdmin` (from `@biorate/kafkajs` `KafkaJSAdminConnector`).

**Directory:** `./migrations/kafka/`

### `Clickhouse` — Clickhouse migrations

```ts
import { Clickhouse } from '@biorate/migrations';
```

Reads SQL files from `migrations/clickhouse/`, executes them via `connection.command()`, and tracks completion in a `migrations` MergeTree table with `name String` primary key.

**Config namespace:** `Clickhouse` (from `@biorate/clickhouse` base config).

**Directory:** `./migrations/clickhouse/`

### `Amqp` — AMQP/RabbitMQ migrations

```ts
import { Amqp } from '@biorate/migrations';
```

Loads and executes JS scripts (`module.exports = async (channel, connection, config, globalConfig) => {...}`) from `migrations/amqp/`. The script receives the AMQP channel for declaring exchanges/queues/bindings. **No tracking**.

**Config namespace:** `Amqp` (from `@biorate/amqp` base config). Additional config: `migrations.Amqp.<name>.amqpChannelOptions`.

**Directory:** `./migrations/amqp/`

### `SchemaRegistry` — Schema Registry migrations

```ts
import { SchemaRegistry } from '@biorate/migrations';
```

Reads `.avsc.json` / `.json` files named `00001_subjectname.avsc.json` from `migrations/schema-registry/`. Each file is registered as a new subject or a new version of an existing subject on the Schema Registry.

| Feature              | Description                                            |
|----------------------|--------------------------------------------------------|
| File pattern         | `00001_{subject}.avsc.json`                            |
| Compatibility        | Set via config, defaults to `FORWARD`                  |
| On conflict          | Registers a new version for the subject                |
| Errors               | `SchemaRegistryWrongFileNameError` if pattern mismatch |

**Config namespace:** `SchemaRegistry` (from `@biorate/schema-registry` base config).

**Directory:** `./migrations/schema-registry/`

### Errors

| Error                              | Context                              |
|------------------------------------|--------------------------------------|
| `SchemaRegistryWrongFileNameError` | Schema Registry migration file name does not match `00001_name.avsc.json` pattern. |

## Config structure

Your config file (referenced by `MIGRATIONS_CONFIG` env var) must define the connection configs for all engines you use, for example:

```ts
export default {
  Sequelize: [{ name: 'primary', options: { dialect: 'postgres', ... } }],
  MongoDB: [{ name: 'primary', host: 'mongodb://...', options: { dbName: 'test' } }],
  Minio: [{ name: 'primary', options: { endPoint: 'localhost', ... } }],
  KafkaJSAdmin: [{ name: 'primary', options: { 'metadata.broker.list': 'localhost:9092' } }],
  Clickhouse: [{ name: 'primary', options: { host: 'localhost', ... } }],
  Amqp: [{ name: 'primary', options: { hostname: 'localhost', ... } }],
  SchemaRegistry: [{ name: 'primary', options: { baseURL: 'http://localhost:8081' } }],
};
```

## Architecture

```
@biorate/migrations

MIGRATIONS_CONFIG / MIGRATIONS_ROOT env → requireCjs
│
└── Root (DI orchestrator)
    ├── container.bind(SequelizeConnector, MinioConnector, MongoDBConnector, ...)
    │
    └── @init() initialize()
        ├── Sequelize.process()
        │   ├── forEach config → connection.query(sqlFile)
        │   └── INSERT INTO migrations (name) VALUES (...)
        │
        ├── Mongodb.process()
        │   ├── forEach config → require(jsFile)(connection, config, globalConfig)
        │   └── db.migrations.insertOne({ _id: name })
        │
        ├── Minio.process()
        │   ├── forEach config → require(jsFile)(connection, config, globalConfig)
        │   └── client.putObject(migrationBucket, name, ...)
        │
        ├── Kafka.process()
        │   └── forEach config → require(jsFile)(adminClient, config, globalConfig)
        │
        ├── Clickhouse.process()
        │   ├── forEach config → connection.command(sqlFile)
        │   └── INSERT INTO migrations (name) VALUES (...)
        │
        ├── Amqp.process()
        │   └── forEach config → require(jsFile)(channel, connection, config, globalConfig)
        │
        └── SchemaRegistry.process()
            └── forEach config → POST /subjects/{subject}/versions
                └── SchemaRegistryWrongFileNameError check
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/migrations.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/migrations/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/migrations/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
