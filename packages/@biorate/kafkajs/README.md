# KafkaJS

KafkaJS connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { KafkaJSProducerConnector } from '@biorate/kafkajs';

class Root extends Core() {
  @inject(KafkaJSProducerConnector) public producer: KafkaJSProducerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<KafkaJSProducerConnector>(KafkaJSProducerConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  KafkaJSGlobal: {
    brokers: ['localhost:9092'],
    clientId: 'test-app',
    logLevel: 1,
  },
  KafkaJSProducer: [
    {
      name: 'producer',
      global: '#{KafkaJSGlobal}',
    },
  ],
});

(async () => {
  const topic = 'test-kafkajs';
  const root = container.get<Root>(Root);
  await root.$run();
  await root.producer!.current!.send({
    topic,
    messages: [
      { key: 'key 1', value: 'hello world 1' },
      { key: 'key 2', value: 'hello world 2' },
      { key: 'key 3', value: 'hello world 3' },
    ],
  });
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/kafkajs.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
