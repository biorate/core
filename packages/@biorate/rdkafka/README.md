# Rdkafka

Rdkafka connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RdkafkaConnector, RdkafkaConfig } from '@biorate/rdkafka';

class Root extends Core() {
  @inject(RdkafkaConnector) public connector: RdkafkaConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RdkafkaConnector>(RdkafkaConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Rdkafka: [
    {
      name: 'connection',
      options: {},
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/rdkafka.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
