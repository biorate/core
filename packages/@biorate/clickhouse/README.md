# Clickhouse

Clickhouse connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ClickhouseConnector, ClickhouseConfig } from '@biorate/clickhouse';

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
      options: {},
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  const data = await root.connector!.query<{ result: number }>('SELECT 1 AS result;');
  console.log(data); // [{ result: 1 }]
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/clickhouse.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/clickhouse/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/clickhouse/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
