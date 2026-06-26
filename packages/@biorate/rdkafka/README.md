# @biorate/rdkafka

Kafka connector — connection manager for `node-rdkafka` with 6 specialized connector classes for producers, consumers, and admin operations.

## Features

- **6 connector classes** — AdminClient, Consumer, ConsumerStream, Producer, HighLevelProducer, ProducerStream.
- **Auto-connect** — each class creates its `node-rdkafka` client on `@init()` via config namespace `Rdkafka`.
- **Producer support** — standard and high-level producers with queue flushing.
- **Consumer support** — standard and streaming consumers.
- **Admin client** — metadata, topics, configuration management.
- **Typed errors** — `RdkafkaCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/rdkafka
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `node-rdkafka`.

## Quick start

### Producer

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RdkafkaProducerConnector } from '@biorate/rdkafka';

class Root extends Core() {
  @inject(RdkafkaProducerConnector) public connector: RdkafkaProducerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RdkafkaProducerConnector>(RdkafkaProducerConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Rdkafka: [{
    name: 'producer',
    options: {
      'client.id': 'kafka',
      'metadata.broker.list': 'localhost:9092',
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.produce('test-topic', null, Buffer.from('Hello!'));
})();
```

### Consumer

```ts
import { RdkafkaConsumerConnector } from '@biorate/rdkafka';

class Root extends Core() {
  @inject(RdkafkaConsumerConnector) public connector: RdkafkaConsumerConnector;
}

container.bind<RdkafkaConsumerConnector>(RdkafkaConsumerConnector).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Rdkafka: [{
    name: 'consumer',
    options: {
      'client.id': 'kafka-consumer',
      'metadata.broker.list': 'localhost:9092',
      'group.id': 'test-group',
    },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.connector.current!
    .on('data', (data) => console.log(data.value?.toString()))
    .subscribe(['test-topic']);
})();
```

## API Reference

### Connector classes

| Class                          | Connection type          | Description                    |
|--------------------------------|--------------------------|--------------------------------|
| `RdkafkaAdminClientConnector`  | `AdminClient`            | Kafka admin operations.        |
| `RdkafkaConsumerConnector`     | `KafkaConsumer`          | Standard consumer.             |
| `RdkafkaConsumerStreamConnector` | `ConsumerStream`       | Stream-based consumer.         |
| `RdkafkaProducerConnector`     | `Producer`               | Standard producer.             |
| `RdkafkaHighLevelProducerConnector` | `HighLevelProducer` | High-level producer.           |
| `RdkafkaProducerStreamConnector` | `ProducerStream`      | Stream-based producer.         |

All share the same `namespace = 'Rdkafka'`.

### Common members

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'Rdkafka'`                               | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<ConnectionType>`     | Creates and connects the corresponding client. |

### Config

```ts
interface IRdkafkaConfig extends IConnectorConfig {
  options: ProducerConfig | ConsumerConfig;  // node-rdkafka config (broker list, client.id, group.id, etc.)
}
```

### Errors

| Error                        | Condition                                    |
|------------------------------|----------------------------------------------|
| `RdkafkaCantConnectError`    | Client creation or connection fails.         |

## Architecture

```
Rdkafka*Connector extends Connector<IRdkafkaConfig, *Client>
│
├── namespace = 'Rdkafka'
├── connect(config)
│   ├── new Producer / Consumer / AdminClient(config.options)
│   └── await connection.connect() or connection.subscribe() depending on type
│
└── All 6 classes register under the same config namespace,
    differentiated by the `name` field in the config array.
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/rdkafka.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/LICENSE)
