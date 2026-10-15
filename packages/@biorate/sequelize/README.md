# @biorate/sequelize

Sequelize ORM connector — connection manager for Sequelize with model auto-loading and multi-connection support.

## Features

- **Auto-connect** — creates a Sequelize instance on `@init()` via the config namespace `Sequelize`.
- **Model auto-loading** — declare models in a `protected readonly models` map on a connector subclass; they are attached to the matching named connection.
- **Connection verification** — calls `authenticate()` after initialisation.
- **Multi-connection** — named connections, each with its own model list.
- **Typed errors** — `SequelizeCantConnectError`, `UndefinedConnectionError`.

## Installation

```bash
pnpm add @biorate/sequelize
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, and the peer dependencies `sequelize` (`6.37.3`) and `sequelize-typescript` (`2.1.6`).

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SequelizeConnector, Table, Column, Model, DataType } from '@biorate/sequelize';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @Column({ type: DataType.STRING, primaryKey: true })
  key: string;

  @Column(DataType.INTEGER)
  value: number;
}

// Declare the models for each named connection.
class AppSequelizeConnector extends SequelizeConnector {
  protected readonly models = { connection: [User] };
}

class Root extends Core() {
  @inject(AppSequelizeConnector) public connector: AppSequelizeConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<AppSequelizeConnector>(AppSequelizeConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name: 'connection',
      options: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  await User.sync();
  await User.create({ key: 'test', value: 1 });

  const [row] = await root.connector.query<{ result: number }>(
    'SELECT $first + $second AS result',
    { bind: { first: 2, second: 2 } },
  );
  console.log(row); // { result: 4 }
})();
```

## API Reference

### `SequelizeConnector`

| Member                 | Type                                        | Description                                                                                    |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `namespace`            | `'Sequelize'`                               | Config key for connection definitions.                                                         |
| `models`               | `{ [name: string]: IModels }`               | Map of connection name → model list. Declared in a subclass.                                   |
| `connect(config)`      | `(config) => Promise<ISequelizeConnection>` | Creates a Sequelize instance and authenticates; throws `SequelizeCantConnectError` on failure. |
| `query(sql, options?)` | `(sql, options?) => Promise<T[]>`           | Executes a raw query on the current (or named) connection.                                     |

`IModels` is `string[] | ModelCtor[]`.

### `query()`

```ts
public async query<T = unknown>(
  sql: string | { query: string; values: unknown[] },
  options?: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
    connection?: string;
  },
): Promise<T[]>
```

Runs the query on the connection named by `options.connection`, or on `current` when omitted. Throws `UndefinedConnectionError` when the referenced connection does not exist.

### Config

```ts
interface ISequelizeConfig extends IConnectorConfig {
  host: string;
  options: Options & { models?: IModels }; // dialect, host, port, username, password, database, storage, ...
}
```

### Errors

| Error                       | Condition                                              |
| --------------------------- | ------------------------------------------------------ |
| `SequelizeCantConnectError` | `new Sequelize()` or `authenticate()` fails.           |
| `UndefinedConnectionError`  | `query()` references a connection that does not exist. |

## Architecture

```
SequelizeConnector extends Connector<ISequelizeConfig, ISequelizeConnection>
│
├── namespace = 'Sequelize'
├── models = { [name]: IModels }   // declared in a subclass
├── connect(config) → new Sequelize({ ...config.options, models })
│   └── await connection.authenticate()
│
├── query(sql, options?) → connection.query(...)
│   └── throws UndefinedConnectionError for an unknown connection name
│
└── connection is a Sequelize instance (sequelize-typescript) with the declared models attached
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/sequelize.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/LICENSE)
