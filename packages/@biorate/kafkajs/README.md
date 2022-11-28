# KafkaJS

KafkaJS connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { KafkaJSConnector, KafkaJSConfig } from '@biorate/kafkajs';

class Root extends Core() {
  @inject(KafkaJSConnector) public connector: KafkaJSConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<KafkaJSConnector>(KafkaJSConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  KafkaJS: [
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

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/kafkajs.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
