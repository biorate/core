# @biorate/kafkajs

KafkaJS connector suite — admin, producer (with Prometheus metrics), and consumer (with auto‑subscribe and batch processing) for Apache Kafka.

## Features

- **Three connector classes** — `KafkaJSAdminConnector`, `KafkaJSProducerConnector`, `KafkaJSConsumerConnector`.
- **Prometheus metrics** — counters and histograms for produce/consume operations (success/error, topic, partition, group).
- **Global config** — `KafkaJSGlobal` can be referenced via `'#{KafkaJSGlobal}'` string interpolation.
- **Consumer batching** — configurable concurrency and chunk size.
- **Producer transactions** — `transaction()` with automatic commit/abort.
- **Custom logging** — routes KafkaJS log levels to `console` with proper severity.

## Installation

```bash
pnpm add @biorate/kafkajs
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/prometheus`, `kafkajs`, `lodash-es`.

## Quick start

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
  KafkaJSGlobal: { brokers: ['localhost:9092'], clientId: 'test-app', logLevel: 1 },
  KafkaJSProducer: [{ name: 'producer', global: '#{KafkaJSGlobal}' }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.producer.current!.send({
    topic: 'test',
    messages: [{ key: 'key', value: 'hello' }],
  });
})();
```

## API Reference

### `KafkaJSProducerConnector`

| Member           | Type                                            | Description                              |
|------------------|-------------------------------------------------|------------------------------------------|
| `namespace`      | `'KafkaJSProducer'`                             | Config key.                              |
| `send(name, record)` | `(string, ProducerRecord) => Promise`       | Send messages with Prometheus tracking.  |
| `transaction(name, record)` | `(string, ProducerRecord) => Promise`  | Send within a transaction (commit/abort on error). |

### `KafkaJSConsumerConnector`

| Member              | Type                                                  | Description                                       |
|---------------------|-------------------------------------------------------|---------------------------------------------------|
| `namespace`         | `'KafkaJSConsumer'`                                    | Config key.                                       |
| `subscribe(name, handler)` | `(string, (messages, batch) => Promise<void>)` | Subscribe to topics with chunked batch processing. |
| `unsubscribe(name)` | `(string) => Promise<void>`                           | Disconnect consumer.                              |

### `KafkaJSAdminConnector`

| Member       | Type                                   | Description        |
|--------------|----------------------------------------|--------------------|
| `namespace`  | `'KafkaJSAdmin'`                       | Config key.        |

### Config

```ts
// Global config (referenced by name)
interface KafkaJSGlobal {
  brokers: string[];
  clientId: string;
  // ... KafkaConfig
}

// Producer
type IKafkaJSProducerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options?: ProducerConfig;
  partitioner?: 'LegacyPartitioner' | 'DefaultPartitioner';
};

// Consumer
type IKafkaJSConsumerConfig = IConnectorConfig & {
  global: KafkaConfig;
  options: ConsumerConfig;
  subscribe?: ConsumerSubscribeTopics;
  runConfig?: ConsumerRunConfig;
  concurrency?: number;
};

// Admin
type IKafkaJSAdminConfig = IConnectorConfig & {
  global: KafkaConfig;
  options?: AdminConfig;
};
```

### Metrics

| Metric                              | Type      | Labels                                              |
|-------------------------------------|-----------|-----------------------------------------------------|
| `kafka_producer_seconds_count`       | Counter   | `topic`, `status`                                   |
| `kafka_producer_seconds`             | Histogram | `topic`, `status`                                   |
| `kafka_consumer_count`               | Counter   | `topic`, `status`, `group`, `partition`             |
| `kafka_consumer_seconds`             | Histogram | `topic`, `status`, `group`, `partition`             |

### Errors

| Error                              | Condition                                 |
|------------------------------------|-------------------------------------------|
| `KafkaJSProducerCantConnectError`  | Producer connection fails.                |
| `KafkaJSConsumerCantConnectError`  | Consumer connection fails.                |
| `KafkaJSAdminCantConnectError`     | Admin client connection fails.            |

## Architecture

```
KafkaJS ──── connectors ──────────────────────────
│
├── KafkaJSProducerConnector
│   ├── namespace = 'KafkaJSProducer'
│   ├── connect() → Kafka.producer()
│   ├── send(name, record) → with Prometheus
│   ├── transaction(name, record) → commit/abort
│   └── metrics: counter + histogram (topic, status)
│
├── KafkaJSConsumerConnector
│   ├── namespace = 'KafkaJSConsumer'
│   ├── connect() → Kafka.consumer()
│   ├── subscribe(name, handler) → batch processing
│   │   └── chunks messages by concurrency
│   │   └── pause/resume per topic
│   │   └── counter + histogram per batch
│   └── unsubscribe(name) → disconnect
│
├── KafkaJSAdminConnector
│   ├── namespace = 'KafkaJSAdmin'
│   └── connect() → Kafka.admin()
│
└── LogCreator — custom logger for KafkaJS
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/kafkajs.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/kafkajs/LICENSE)
