# @biorate/clickhouse

ClickHouse connector — connection manager for the official `@clickhouse/client` library.

## Features

- **Auto-connect** — creates client on `@init()` via config namespace `Clickhouse`.
- **Connection verification** — runs `SELECT 1` on connect to ensure server is reachable.
- **Typed errors** — `ClickhouseCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/clickhouse
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@clickhouse/client`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ClickhouseConnector } from '@biorate/clickhouse';

class Root extends Core() {
  @inject(ClickhouseConnector) public connector: ClickhouseConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ClickhouseConnector>(ClickhouseConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Clickhouse: [
    {
      name: 'connection',
      options: {
        host: 'http://localhost:8123',
        username: 'default',
        password: '',
        database: 'default',
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  const cursor = await root.connector.get().query({
    query: 'SELECT 1 AS result',
    format: 'JSON',
  });
  const { data } = await cursor.json<{ result: number }>();
  console.log(data); // [{ result: 1 }]
})();
```

## API Reference

### `ClickhouseConnector`

| Member           | Type                                          | Description                              |
|------------------|-----------------------------------------------|------------------------------------------|
| `namespace`      | `'Clickhouse'`                                | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IClickhouseConnection>`  | Creates `ClickHouseClient` via `createClient`. |

### Config

```ts
interface IClickhouseConfig extends IConnectorConfig {
  options: NodeClickHouseClientConfigOptions;
}
```

### Errors

| Error                          | Condition                                      |
|--------------------------------|------------------------------------------------|
| `ClickhouseCantConnectError`   | `createClient()` or `SELECT 1` verification fails. |

## Architecture

```
ClickhouseConnector extends Connector<IClickhouseConfig, IClickhouseConnection>
│
├── namespace = 'Clickhouse'
├── connect() → createClient(config.options)
│   └── await connection.query({ query: 'SELECT 1' }) // verify
└── connection is a NodeClickHouseClient
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/clickhouse.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/clickhouse/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/clickhouse/LICENSE)
