# @biorate/ioredis

IORedis connector — connection manager for the `ioredis` Redis client with configurable reconnect strategy.

## Features

- **Auto-connect** — creates `Redis` instance on `@init()` via config namespace `IORedis`.
- **Reconnect strategy** — configurable retry count, timeout delta, and limit.
- **Lazy connect** — uses `lazyConnect: true` for controlled connection timing.
- **Typed errors** — `IORedisCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/ioredis
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `ioredis`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IORedisConnector } from '@biorate/ioredis';

class Root extends Core() {
  @inject(IORedisConnector) public connector: IORedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IORedisConnector>(IORedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  IORedis: [
    {
      name: 'connection',
      options: { host: 'localhost', port: 6379 },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.set('key', 'value');
  console.log(await root.connector.current!.get('key')); // 'value'
})();
```

## API Reference

### `IORedisConnector`

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'IORedis'`                               | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<IIORedisConnection>` | Creates `Redis` instance and connects.   |

### Config

```ts
interface IIORedisConfig extends IConnectorConfig {
  options: RedisOptions & {
    reconnectTimes?: number;          // max reconnect attempts (-1 = infinite)
    reconnectTimeoutDelta?: number;   // ms multiplier, default 100
    reconnectTimeoutLimit?: number;   // max ms between retries, default 5000
  };
}
```

### Errors

| Error                        | Condition                                   |
|------------------------------|---------------------------------------------|
| `IORedisCantConnectError`    | `new Redis()` or `connect()` fails.         |

## Architecture

```
IORedisConnector extends Connector<IIORedisConfig, IIORedisConnection>
│
├── namespace = 'IORedis'
├── connect(config)
│   ├── new Redis({
│   │     retryStrategy: (times) => {
│   │       if (times > reconnectTimes && reconnectTimes !== -1) return null;
│   │       return Math.min(times * delta, limit);
│   │     },
│   │     ...config.options,
│   │     lazyConnect: true,
│   │   })
│   └── await connection.connect()
│
└── connection is a redis: ioredis.Redis
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/ioredis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/LICENSE)
