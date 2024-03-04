# AMQP

AMQP connector

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AmqpConnector } from '@biorate/amqp';

const connectionName = 'amqp';
const channelName = 'test';

export class Root extends Core() {
  @inject(AmqpConnector) public connector: AmqpConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<AmqpConnector>(AmqpConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Amqp: [
    {
      name: connectionName,
      urls: ['amqp://localhost:5672'],
    },
  ],
});

const root = <Root>container.get<Root>(Root);

(async () => {
  root.connector.createChannel(connectionName, {
    name: channelName,
    json: true,
    setup: async (channel: Channel) => {
      await channel.assertExchange('test-exchange', 'topic');
      await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
      await channel.bindQueue('test-queue', 'test-exchange', '#send');
      await channel.consume('test-queue', (data: ConsumeMessage | null) => {
        console.log(data?.content?.toString?.()); // {"test": 1}
      });
    },
  });
  root.connector.channel(channelName)!.publish('test-exchange', '#send', { test: 1 });
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/amqp.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/amqp/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/amqp/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
