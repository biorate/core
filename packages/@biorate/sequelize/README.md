# Mongodb

Mongodb ORM connector based on mongoose and typegoose

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  Severity,
  modelOptions,
  Prop,
  MongoDBConnector,
  IMongoDBConnector,
  model,
  ReturnModelType,
} from '@biorate/mongodb';

// Define models
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: { collection: 'test', versionKey: false },
})
export class TestModel {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: number;
}

// Define root
export class Root extends Core() {
  @inject(MongoDBConnector) public connector: IMongoDBConnector;
  @model(TestModel) public test: ReturnModelType<typeof TestModel>;
}

// Bind dependencies
container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMongoDBConnector>(MongoDBConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

// Configure
container.get<IConfig>(Types.Config).merge({
  MongoDB: [
    {
      name: 'connection',
      host: 'mongodb://localhost:27017/',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'test',
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.connection().dropDatabase();

  const connection = root.connector.connection('connection'); // Get connection instance
  console.log(connection);

  await new root.test({
    firstName: 'Vasya',
    lastName: 'Pupkin',
    age: 36,
  }).save(); // insert data into test collection

  // Get data from database
  const data = await root.test.find({ firstName: 'Vasya' }, { _id: 0 });
  console.log(data); // {
                     //   firstName: 'Vasya',
                     //   lastName: 'Pupkin',
                     //   age: 36,
                     // }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mongodb.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/mongodb/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/mongodb/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
