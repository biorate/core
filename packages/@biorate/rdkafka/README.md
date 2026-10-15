# @biorate/rdkafka

Kafka connectors — connection managers for `@confluentinc/kafka-javascript` with 6 specialized connector classes for producers, consumers, and admin operations.

## Features

- **6 connector classes** — `RDKafkaAdminConnector`, `RDKafkaProducerConnector`, `RDKafkaConsumerConnector`, `RDKafkaHighLevelProducerConnector`, `RDKafkaProducerStreamConnector`, `RDKafkaConsumerStreamConnector`.
- **Per-class config namespaces** — each connector reads its own config key (`RDKafkaAdmin`, `RDKafkaProducer`, `RDKafkaConsumer`, `RDKafkaHighLevelProducer`, `RDKafkaProducerStream`, `RDKafkaConsumerStream`).
- **Auto-connect** — each class creates and connects its client on `@init()`.
- **Producer support** — standard and high-level producers, promisified methods, poll interval.
- **Consumer support** — standard and streaming consumers.
- **Admin client** — topic creation/deletion and partition management.
- **Typed per-class errors** — each connector throws its own `*CantConnectError` on connection failure.
- **Prometheus metrics** — high-level producer and consumer stream emit counters/histograms.

## Installation

```bash
pnpm add @biorate/rdkafka
```

Peer dependencies:

```bash
@confluentinc/kafka-javascript >=1.9.0
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/prometheus`, `@biorate/tools`.

## Quick start

### Producer

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RDKafkaProducerConnector } from '@biorate/rdkafka';

class Root extends Core() {
  @inject(RDKafkaProducerConnector) public connector: RDKafkaProducerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<RDKafkaProducerConnector>(RDKafkaProducerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  RDKafkaProducer: [
    {
      name: 'producer',
      global: {
        'bootstrap.servers': 'localhost:9092',
        'client.id': 'kafka',
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  root.connector.current!.produce('test-topic', null, Buffer.from('Hello!'));
})();
```

### Consumer

```ts
import { RDKafkaConsumerConnector } from '@biorate/rdkafka';

class Root extends Core() {
  @inject(RDKafkaConsumerConnector) public connector: RDKafkaConsumerConnector;
}

container
  .bind<RDKafkaConsumerConnector>(RDKafkaConsumerConnector)
  .toSelf()
  .inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  RDKafkaConsumer: [
    {
      name: 'consumer',
      global: {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'test-group',
      },
      topic: {
        'auto.offset.reset': 'earliest',
        'enable.auto.commit': false,
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  const consumer = root.connector.current!;
  consumer.subscribe(['test-topic']);
  const messages = await consumer.consumePromise(1);
})();
```

## API Reference

### Connector classes

| Class                               | Namespace                  | Config type                       | Description             |
| ----------------------------------- | -------------------------- | --------------------------------- | ----------------------- |
| `RDKafkaAdminConnector`             | `RDKafkaAdmin`             | `IRDKafkaAdminConfig`             | Kafka admin operations. |
| `RDKafkaProducerConnector`          | `RDKafkaProducer`          | `IRDKafkaProducerConfig`          | Standard producer.      |
| `RDKafkaConsumerConnector`          | `RDKafkaConsumer`          | `IRDKafkaConsumerConfig`          | Standard consumer.      |
| `RDKafkaHighLevelProducerConnector` | `RDKafkaHighLevelProducer` | `IRDKafkaHighLevelProducerConfig` | High-level producer.    |
| `RDKafkaProducerStreamConnector`    | `RDKafkaProducerStream`    | `IRDKafkaProducerStreamConfig`    | Stream-based producer.  |
| `RDKafkaConsumerStreamConnector`    | `RDKafkaConsumerStream`    | `IRDKafkaConsumerStreamConfig`    | Stream-based consumer.  |

Each class extends `Connector<Config, Connection>` and exposes the inherited members: `current`, `connections`, `use(name)`, `connection(name?)`, `get(name?)`, `create(config)`.

### Config

The `global` and `topic` fields are typed by `@confluentinc/kafka-javascript`; use the plain `{ global, topic?, pollInterval? }` shape, not a nested `options` object.

```ts
interface IRDKafkaProducerConfig extends IConnectorConfig {
  global: ProducerGlobalConfig;
  topic?: ProducerTopicConfig;
  pollInterval?: number;
}

interface IRDKafkaConsumerConfig extends IConnectorConfig {
  global: ConsumerGlobalConfig;
  topic: ConsumerTopicConfig;
}

interface IRDKafkaAdminConfig extends IConnectorConfig {
  global: GlobalConfig;
}
```

The stream connectors add a `stream` field (`WriteStreamOptions` for producers, `ReadStreamOptions` for consumers); the consumer stream also accepts `buffer?`, `concurrency?`, `batch?`, `delay?`.

### Errors

| Error                                         | Condition                                          |
| --------------------------------------------- | -------------------------------------------------- |
| `RDKafkaAdminCantConnectError`                | Admin client creation fails.                       |
| `RDKafkaProducerCantConnectError`             | Producer creation or connection fails.             |
| `RDKafkaConsumerCantConnectError`             | Consumer creation or connection fails.             |
| `RDKafkaHighLevelProducerCantConnectError`    | High-level producer creation or connection fails.  |
| `RDKafkaProducerStreamCantConnectError`       | Producer stream creation fails.                    |
| `RDKafkaConsumerStreamCantConnectError`       | Consumer stream creation fails.                    |
| `RDKafkaConsumerStreamAlreadySubscribedError` | Subscribing an already-subscribed consumer stream. |

### Metrics

The high-level producer and the consumer stream record Prometheus metrics (labels `topic`, `status`; the consumer stream also `group`, `partition`):

| Metric                         | Type      | Labels                                  |
| ------------------------------ | --------- | --------------------------------------- |
| `kafka_producer_seconds_count` | Counter   | `topic`, `status`                       |
| `kafka_producer_seconds`       | Histogram | `topic`, `status`                       |
| `kafka_consumer_count`         | Counter   | `topic`, `status`, `group`, `partition` |
| `kafka_consumer_seconds`       | Histogram | `topic`, `status`, `group`, `partition` |

## Architecture

```
RDKafka*Connector extends Connector<IRDKafka*Config, *Connection>
│
├── namespace = 'RDKafkaAdmin' | 'RDKafkaProducer' | ... (per class)
├── connect(config)
│   ├── producer / high-level producer → new *Connection(global, topic),
│   │     setPollInterval(pollInterval ?? 100), await connectPromise()
│   ├── consumer → new *Connection(global, topic), await connectPromise()
│   ├── admin → new *Connection(global)
│   ├── producer stream → new *Connection(config) over createWriteStream
│   └── consumer stream → new *Connection(config), subscribe(handler)
└── each class registers under its own config namespace,
    differentiated by the `name` field in the config array.
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/rdkafka.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/rdkafka/LICENSE)
