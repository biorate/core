# Mssql

Mssql raw connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { MssqlConnector, IMssqlConnector } from '@biorate/mssql';

class Root extends Core() {
  @inject(MssqlConnector) public connector: IMssqlConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IMssqlConnector>(MssqlConnector).toSelf().inSingletonScope();
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
        options: {
          trustServerCertificate: true,
        },
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector!.current?.query(
    `CREATE TABLE test (
         count int,
         text varchar(20)
      );`,
  );
  await root.connector!.current?.query(
    `INSERT INTO test (count, text) VALUES (1, 'test1'), (2, 'test2'), (3, 'test3');`,
  );
  console.log(await root.connector!.current?.query(`SELECT * FROM test;`));
  // {
  //   recordsets: [ [ [Object], [Object], [Object] ] ],
  //   recordset: [
  //     { count: 1, text: 'test1' },
  //     { count: 2, text: 'test2' },
  //     { count: 3, text: 'test3' }
  //   ],
  //  output: {},
  //   rowsAffected: [ 3 ]
  //  }
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/mssql.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/mssql/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/mssql/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
