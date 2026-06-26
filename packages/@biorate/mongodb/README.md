# @biorate/mongodb

MongoDB ORM connector — connection manager for Mongoose with `@typegoose/typegoose` model injection.

## Features

- **Auto-connect** — creates Mongoose `Connection` on `@init()` via config namespace `MongoDB`.
- **`@model()` decorator** — inject a typed TypeGoose model bound to a connection.
- **`@typegoose/typegoose` re-exports** — `@Prop()`, `@modelOptions()`, `Severity`, `ReturnModelType`, etc.
- **Connection verification** — waits for `open` event.
- **Multi-connection** — multiple connections, `@model()` optional name parameter.

## Installation

```bash
pnpm add @biorate/mongodb
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/tools`, `mongoose`, `@typegoose/typegoose`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  Severity, modelOptions, Prop,
  MongoDBConnector, model, ReturnModelType,
} from '@biorate/mongodb';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { collection: 'test', versionKey: false },
})
class TestModel {
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() age: number;
}

class Root extends Core() {
  @inject(MongoDBConnector) public connector: MongoDBConnector;
  @model(TestModel) public test: ReturnModelType<typeof TestModel>;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<MongoDBConnector>(MongoDBConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  MongoDB: [{
    name: 'connection',
    host: 'mongodb://localhost:27017/',
    options: { dbName: 'test' },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await new root.test({ firstName: 'Vasya', lastName: 'Pupkin', age: 36 }).save();
  const data = await root.test.find({ firstName: 'Vasya' }, { _id: 0 });
  console.log(data); // [{ firstName: 'Vasya', lastName: 'Pupkin', age: 36 }]
})();
```

## API Reference

### `MongoDBConnector`

| Member           | Type                                        | Description                              |
|------------------|---------------------------------------------|------------------------------------------|
| `namespace`      | `'MongoDB'`                                 | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IMongoDBConnection>`   | Creates Mongoose connection via `createConnection`. |

### `@model()` decorator

```ts
@model(ModelClass, connectionName?, options?)
```

Binds a TypeGoose model class to a specific named connection (or the first connection if omitted).

### Config

```ts
interface IMongoDBConfig extends IConnectorConfig {
  host: string;                           // mongodb://host:port/
  options: ConnectOptions;                // dbName, auth, ssl, etc.
}
```

### Errors

| Error                              | Condition                                      |
|------------------------------------|------------------------------------------------|
| `MongoDBCantConnectError`          | `createConnection()` or `open` event fails.    |
| `MongoDBConnectionNotExistsError`  | `@model()` references a non-existent connection. |

## Usage patterns

### Multi-connection with named models

```ts
config: {
  MongoDB: [
    { name: 'primary', host: 'mongodb://primary:27017/', options: { dbName: 'app' } },
    { name: 'archive', host: 'mongodb://archive:27017/', options: { dbName: 'archive' } },
  ],
}

class Root extends Core() {
  @model(UserModel, 'primary') public users: ReturnModelType<typeof UserModel>;
  @model(LogModel, 'archive') public logs: ReturnModelType<typeof LogModel>;
}
```

### Raw connection access

```ts
const conn = root.connector.connection('primary');
// conn is a mongoose.Connection — use conn.collection(), conn.model(), etc.
```

## Architecture

```
MongoDBConnector extends Connector<IMongoDBConfig, IMongoDBConnection>
│
├── namespace = 'MongoDB'
├── connect(config) → createConnection(host, options)
│   └── await events.once(connection, 'open')
│
├── @init() initialize()
│   ├── store connections reference globally (for @model decorator)
│   └── super.initialize() — creates all connections from config
│
└── model(Model, connectionName?, options?) → property decorator
    └── getter → getModelForClass(Model, { existingConnection })
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mongodb.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/mongodb/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/mongodb/LICENSE)
