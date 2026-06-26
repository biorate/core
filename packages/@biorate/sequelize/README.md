# @biorate/sequelize

Sequelize ORM connector — connection manager for Sequelize with model auto-loading and multi-connection support.

## Features

- **Auto-connect** — creates Sequelize instance on `@init()` via config namespace `Sequelize`.
- **Model auto-loading** — `add()` registers models; `load()` attaches them to all connections.
- **Connection verification** — calls `authenticate()` after initialisation.
- **Multi-connection** — named connections with model-copy per connection.
- **Typed errors** — `SequelizeCantConnectError` on failure.

## Installation

```bash
pnpm add @biorate/sequelize
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `sequelize`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { SequelizeConnector } from '@biorate/sequelize';
import { Sequelize, DataTypes, Model } from 'sequelize';

class User extends Model {}

const attributes = {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
};

class Root extends Core() {
  @inject(SequelizeConnector) public connector: SequelizeConnector;
  protected constructor() {
    super();
    this.connector.add(User, { tableName: 'users' }, attributes);
  }
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<SequelizeConnector>(SequelizeConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Sequelize: [{
    name: 'connection',
    options: {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.connector.load('connection');  // attaches User model to 'connection'
  await root.connector.current!.sync();
  const user = await root.connector.current!.model('User').create({
    firstName: 'Vasya', lastName: 'Pupkin',
  });
  console.log(user.toJSON());
})();
```

## API Reference

### `SequelizeConnector`

| Member           | Type                                        | Description                              |
|------------------|---------------------------------------------|------------------------------------------|
| `namespace`      | `'Sequelize'`                               | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<ISequelizeConnection>` | Creates Sequelize instance and authenticates. |
| `add(model, options?, attributes?, indexes?)` | `(...) => void` | Register a model class for later loading. |
| `load(name)`     | `(name) => void`                            | Copies all registered models into a named connection. |

### Config

```ts
interface ISequelizeConfig extends IConnectorConfig {
  options: SequelizeOptions;  // dialect, host, port, username, password, database, etc.
}
```

### Errors

| Error                          | Condition                                    |
|--------------------------------|----------------------------------------------|
| `SequelizeCantConnectError`    | `new Sequelize()` or `authenticate()` fails. |

## Architecture

```
SequelizeConnector extends Connector<ISequelizeConfig, ISequelizeConnection>
│
├── namespace = 'Sequelize'
├── connect(config) → new Sequelize(config.options)
│   └── await connection.authenticate()
│
├── add(Model, options?, attributes?, indexes?)
│   └── stores model definition in internal registry
│
├── load(name)
│   ├── get connection(name)
│   └── for each registered model → connection.define(...)
│
└── connection is a Sequelize instance with attached model classes
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/sequelize.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/LICENSE)
