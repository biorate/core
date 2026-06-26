# @biorate/amqp

AMQP (RabbitMQ) connector — connection manager with channel support for `amqp-connection-manager` and `amqplib`.

## Features

- **Connection lifecycle** — auto-connect on `@init()`, config-driven via `Amqp` namespace.
- **Named channels** — create and retrieve channels by name via `createChannel()` / `channel()`.
- **Configurable reconnect** — inherits `amqp-connection-manager` reconnect strategy.
- **Event-based readiness** — waits for `connect` event before marking connection ready.
- **Standardised errors** — typed errors for connection failures and missing channels.

## Installation

```bash
pnpm add @biorate/amqp
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/tools`, `amqp-connection-manager`, `amqplib`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { AmqpConnector } from '@biorate/amqp';

class Root extends Core() {
  @inject(AmqpConnector) public connector: AmqpConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<AmqpConnector>(AmqpConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Amqp: [
    {
      name: 'amqp',
      urls: ['amqp://localhost:5672'],
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();

  root.connector.createChannel('amqp', {
    name: 'test',
    json: true,
    setup: async (channel) => {
      await channel.assertExchange('test-exchange', 'topic');
      await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
      await channel.bindQueue('test-queue', 'test-exchange', '#send');
      await channel.consume('test-queue', (data) => {
        console.log(data?.content?.toString?.());
      });
    },
  });
  root.connector.channel('test')!.publish('test-exchange', '#send', { test: 1 });
})();
```

## API Reference

### `AmqpConnector`

| Member           | Type                                          | Description                               |
|------------------|-----------------------------------------------|-------------------------------------------|
| `namespace`      | `'Amqp'`                                      | Config key for connection definitions.    |
| `connect(config)` | `(config) => Promise<IAmqpConnection>`        | Connects via `amqp-connection-manager`.   |
| `createChannel(name, opts)` | `(string, ICreateChannelOpts) => ChannelWrapper` | Creates a named channel on a connection.  |
| `channel(name)`  | `(string) => ChannelWrapper`                  | Retrieves a previously created channel.   |

### Config

```ts
interface IAmqpConfig extends IConnectorConfig {
  urls: ConnectionUrl | ConnectionUrl[];
  options?: AmqpConnectionManagerOptions;
}
```

### Errors

| Error                          | Condition                                   |
|--------------------------------|---------------------------------------------|
| `AmqpCantConnectError`         | Connection to AMQP server fails.            |
| `ChannelNotExistsError`        | Requested channel name was not created.     |

## Usage patterns

### Multi-connection

```ts
config: {
  Amqp: [
    { name: 'primary', urls: ['amqp://primary:5672'] },
    { name: 'secondary', urls: ['amqp://secondary:5672'] },
  ],
}
```

### Channel with setup

```ts
connector.createChannel('connectionName', {
  name: 'worker',
  json: true,
  setup: async (channel) => {
    await channel.prefetch(10);
    await channel.assertQueue('tasks');
    await channel.consume('tasks', (msg) => {
      // process
      channel.ack(msg);
    });
  },
});
```

## Architecture

```
AmqpConnector extends Connector<IAmqpConfig, IAmqpConnection>
│
├── namespace = 'Amqp'
├── connect() → amqp-connection-manager connect()
│   └── waits for 'connect' event
│
├── channels: Map<name, ChannelWrapper>
├── createChannel(name, opts) → ChannelWrapper
└── channel(name) → ChannelWrapper
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/amqp.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/amqp/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/amqp/LICENSE)
