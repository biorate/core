# Sequelize

Sequelize ORM connector

### Examples:

```ts
import { join } from 'path';
import { tmpdir } from 'os';
import { container, Core, inject, Types } from '@biorate/inversion';
import { Config, IConfig } from '@biorate/config';
import {
  ISequelizeConnector,
  SequelizeConnector as BaseSequelizeConnector,
} from '@biorate/sequelize';
import { Table, Column, Model, DataType } from '@biorate/sequelize';

const connectionName = 'db';

// Create model
@Table({
  tableName: 'test',
  timestamps: false,
})
export class TestModel extends Model {
  @Column({ type: DataType.CHAR, primaryKey: true })
  key: string;

  @Column(DataType.INTEGER)
  value: number;
}

// Assign models with sequelize connector
class SequelizeConnector extends BaseSequelizeConnector {
  protected readonly models = { [connectionName]: [TestModel] };
}

// Create Root class
export class Root extends Core() {
  @inject(SequelizeConnector) public connector: ISequelizeConnector;
}

// Bind dependencies
container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ISequelizeConnector>(SequelizeConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

// Merge config
container.get<IConfig>(Types.Config).merge({
  Sequelize: [
    {
      name: connectionName,
      options: {
        logging: false,
        dialect: 'sqlite',
        storage: join(tmpdir(), 'sqlite-test.db'),
      },
    },
  ],
});

// Example
(async () => {
  await container.get<Root>(Root).$run();
  // Drop table if exists
  await TestModel.drop();
  // Create table
  await TestModel.sync();
  // Create model item
  await TestModel.create({ key: 'test', value: 1 });
  // Create find model item by key
  const data = await TestModel.findOne({ where: { key: 'test' } });
  console.log(data.toJSON()); // { key: 'test', value: 1 }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/sequelize.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/sequelize/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
