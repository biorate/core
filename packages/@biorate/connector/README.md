# @biorate/connector

Abstract base class for creating typed, config‑driven connection managers backed by `@biorate/inversion` and `@biorate/config`.

## Features

- **Abstract `Connector<C, R>`** — define `connect(config): Promise<R>` for any resource.
- **Config‑driven** — reads an array of connection configs from `this.namespace` in `@biorate/config`.
- **Auto‑connect** — on `@init()`, creates all connections defined in config.
- **Named connections** — access by name via `.connection(name)` or `.get(name)`.
- **Current connection** — first config entry becomes the default; switch via `.use(name)`.
- **Error handling** — typed errors for missing or empty connections.

## Installation

```bash
pnpm add @biorate/connector
```

Requires `@biorate/config`, `@biorate/errors`, `@biorate/inversion`.

## Quick start

```ts
import { Connector } from '@biorate/connector';

class Connection {
  constructor(public name: string) {}
}

class MyConnector extends Connector<{ name: string }, Connection> {
  protected namespace = 'MyConnector';

  protected async connect(config: { name: string }) {
    return new Connection(config.name);
  }
}
```

With DI:

```ts
import { Core, container, Types } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';

class Root extends Core() {
  @inject(MyConnector) public connector: MyConnector;
}

container.bind(Types.Config).to(Config).inSingletonScope();
container.bind(MyConnector).toSelf().inSingletonScope();
container.bind(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  MyConnector: [{ name: 'db-1' }, { name: 'db-2' }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  console.log(root.connector.connection('db-1')); // Connection { name: 'db-1' }
  console.log(root.connector.current);            // Connection { name: 'db-1' }

  root.connector.use('db-2');
  console.log(root.connector.current);            // Connection { name: 'db-2' }
})();
```

## API Reference

### `Connector<C extends IConnectorConfig, T>` abstract class

| Member                    | Type                          | Description                                    |
|---------------------------|-------------------------------|------------------------------------------------|
| `namespace` (abstract)    | `string`                      | Config key — array of `C` objects.             |
| `connect(config)` (abstract) | `(config: C) => Promise<R>`  | Create a single connection.                    |
| `current`                 | `R \| undefined`              | Currently selected connection.                 |
| `connections`             | `Map<string, R>`              | All created connections (name → instance).     |
| `create(config)`          | `(config: C) => Promise<R>`  | Create connection if not already cached.       |
| `connection(name?)`       | `(name?: string) => R`        | Get connection by name (or current).           |
| `get(name?)`              | `(name?: string) => R`        | Alias for `connection()`.                      |
| `use(name)`               | `(name: string) => void`      | Switch current connection.                     |
| `initialize()`            | `@init()`                     | Reads config array, creates all connections.   |

### Config interface

```ts
interface IConnectorConfig {
  name: string;  // connection identifier (unique per connector)
  // … plus any additional fields for your resource
}
```

### Errors

| Error                              | Condition                                        |
|------------------------------------|--------------------------------------------------|
| `ConnectorConnectionNotExistsError`| Calling `connection(name)` / `use(name)` with unknown name. |
| `ConnectorEmptyConnectionsError`   | Calling `connection()` when no connections exist.             |

## Usage patterns

### Single connection

```ts
class MyConnector extends Connector<{ name: string; host: string; port: number }, Client> {
  protected namespace = 'MyConnector';

  protected async connect(config: { name: string; host: string; port: number }) {
    const client = new Client();
    await client.connect(config.host, config.port);
    return client;
  }
}
```

Config:

```json
{
  "MyConnector": [{ "name": "default", "host": "localhost", "port": 5432 }]
}
```

### Multi‑connection (read replicas)

```ts
{
  "MyConnector": [
    { "name": "primary",   "host": "db-1.internal", "port": 5432 },
    { "name": "replica-1", "host": "db-2.internal", "port": 5432 },
    { "name": "replica-2", "host": "db-3.internal", "port": 5432 },
  ]
}
```

```ts
// Switch for read operations:
connector.use('replica-1');
const data = await connector.current.query('SELECT …');

// Switch back for writes:
connector.use('primary');
```

### Dynamic connection creation

```ts
class MyConnector extends Connector<{ name: string; url: string }, Resource> {
  protected namespace = 'MyConnector';
  protected async connect(config: { name: string; url: string }) {
    return new Resource(config.url);
  }
}

// At runtime:
await connector.create({ name: 'ad-hoc', url: 'https://…' });
const resource = connector.connection('ad-hoc');
```

### Type override for config

```ts
interface RedisConfig extends IConnectorConfig {
  host: string;
  port: number;
  db: number;
}

class RedisConnector extends Connector<RedisConfig, RedisClient> {
  protected namespace = 'RedisConnector';
  protected async connect(config: RedisConfig) {
    return new RedisClient({ host: config.host, port: config.port, db: config.db });
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Connector                  │  abstract class
├─────────────────────────────────────────────┤
│  namespace: string  ─── config key          │
│  #connections: Map<name, R>                 │
│  #current: R         ─── selected           │
│                                              │
│  @init() initialize()                        │
│    ├── for each config in namespace[]        │
│    │   └── this.create(config)               │
│    │       └── this.connect(config)  ← abstract
│    └── set #current = first entry            │
│                                              │
│  connection(name?) → R                       │
│  use(name) → void                            │
│  create(config) → Promise<R>                 │
└─────────────────────────────────────────────┘
         ▲             extends
         │
┌─────────────────────────────────────────────┐
│         RedisConnector / MongoConnector …      │
│         connect(config) → Promise<R>         │
└─────────────────────────────────────────────┘
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/connector.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/connector/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/connector/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
