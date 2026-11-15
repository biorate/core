# @biorate/mssql

MSSQL connector — connection manager for the `mssql` library (Microsoft SQL Server).

## Features

- **Auto-connect** — creates `ConnectionPool` on `@init()` via config namespace `Mssql`.
- **Full TSQL support** — raw `query()`, prepared statements, stored procedures via the `mssql` connection.
- **Typed errors** — `MssqlCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/mssql
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `mssql`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MssqlConnector } from '@biorate/mssql';

class Root extends Core() {
  @inject(MssqlConnector) public connector: MssqlConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<MssqlConnector>(MssqlConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Mssql: [
    {
      name: 'connection',
      options: {
        server: 'localhost',
        user: 'sa',
        password: 'admin_007',
        database: 'master',
        options: { trustServerCertificate: true },
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.query(`
    CREATE TABLE #test (count int, text varchar(20));
    INSERT INTO #test (count, text) VALUES (1, 'test1'), (2, 'test2');
    SELECT * FROM #test;
  `);
  const result = await root.connector.current!.query(`SELECT 1 AS result`);
  console.log(result.recordset); // [{ result: 1 }]
})();
```

## API Reference

### `MssqlConnector`

| Member            | Type                                    | Description                                   |
| ----------------- | --------------------------------------- | --------------------------------------------- |
| `namespace`       | `'Mssql'`                               | Config key for connection definitions.        |
| `connect(config)` | `(config) => Promise<IMssqlConnection>` | Creates `ConnectionPool` via `mssql.connect`. |

### Config

```ts
interface IMssqlConfig extends IConnectorConfig {
  options: config; // mssql ConnectionPool config (server, user, password, database, etc.)
}
```

### Errors

| Error                   | Condition                |
| ----------------------- | ------------------------ |
| `MssqlCantConnectError` | `mssql.connect()` fails. |

## Architecture

```
MssqlConnector extends Connector<IMssqlConfig, IMssqlConnection>
│
├── namespace = 'Mssql'
├── connect(config) → await mssql.connect(config.options)
└── connection is a mssql.ConnectionPool
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mssql.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/mssql/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/mssql/LICENSE)

---

[![Donate on Boosty](https://img.shields.io/badge/Boosty-donate-orange)](https://boosty.to/llevkin)

Donations are voluntary and do not constitute consideration for any goods or services; they grant no rights to the code or priority in decision-making, and the project is provided AS IS under its license.
