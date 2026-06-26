# @biorate/pg

PostgreSQL connector — connection manager for the `pg` (node-postgres) library with cursor and stream support.

## Features

- **Auto-connect** — creates `Client` on `@init()` via config namespace `Pg`.
- **Cursor support** — `cursor()` method for efficient large-result iteration (`pg-cursor`).
- **Query stream** — `stream()` method for pipeable query results (`pg-query-stream`).
- **Typed errors** — `PgCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/pg
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `pg`, `pg-cursor`, `pg-query-stream`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { PgConnector } from '@biorate/pg';

class Root extends Core() {
  @inject(PgConnector) public connector: PgConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<PgConnector>(PgConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Pg: [{
    name: 'connection',
    options: {
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  const res = await root.connector.current!.query('SELECT 1 AS result');
  console.log(res.rows); // [{ result: 1 }]
})();
```

## API Reference

### `PgConnector`

| Member            | Type                                                  | Description                                    |
|-------------------|-------------------------------------------------------|------------------------------------------------|
| `namespace`       | `'Pg'`                                                | Config key for connection definitions.         |
| `connect(config)` | `(config) => Promise<IPgConnection>`                  | Creates `pg.Client` and connects.              |
| `cursor(name, query, values?, config?)` | `(string, string, any[], CursorQueryConfig?) => Cursor` | Returns a `pg-cursor` Cursor for efficient iteration. |
| `stream(name, query, values?, config?)` | `(string, string, any[], CursorQueryConfig?) => QueryStream` | Returns a `pg-query-stream` for pipeable results. |

### Config

```ts
interface IPgConfig extends IConnectorConfig {
  options: ClientConfig;  // pg ClientConfig (host, port, user, password, database, ssl, etc.)
}
```

### Errors

| Error                  | Condition                                   |
|------------------------|---------------------------------------------|
| `PgCantConnectError`   | `new Client()` or `client.connect()` fails. |

## Usage patterns

### Cursor for large datasets

```ts
const cursor = root.connector.cursor('connection', 'SELECT * FROM large_table');
// cursor.read(100) — read in batches
```

### Query stream

```ts
const stream = root.connector.stream('connection', 'SELECT * FROM events');
stream.pipe(someTransform).pipe(res);
```

## Architecture

```
PgConnector extends Connector<IPgConfig, IPgConnection>
│
├── namespace = 'Pg'
├── connect(config) → new Client(config.options)
│   └── await connection.connect()
│
├── cursor(name, query, values?, config?)
│   └── this.get(name).query(new Cursor(query, values, config))
│
└── stream(name, query, values?, config?)
    └── this.get(name).query(new QueryStream(query, values, config))
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/pg.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/pg/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/pg/LICENSE)
