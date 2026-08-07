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
    reconnectTimes?: number;            // default: -1 (infinite attempts)
    reconnectTimeoutDelta?: number;     // default: 30_000 (ms)
    reconnectTimeoutLimit?: number;     // default: 30_000 (ms)
    failoverDetector?: boolean;         // default: true
    gracefulDegradation?: boolean;      // default: true
  };
}
```

## Graceful Degradation

By default, all Redis commands return `null` instead of throwing errors when Redis is unavailable. This is controlled by the `gracefulDegradation` option.

### Usage

```ts
container.get<IConfig>(Types.Config).merge({
  IORedis: [
    {
      name: 'connection',
      options: {
        host: 'localhost',
        port: 6379,
        
        // Enable graceful degradation (default: true)
        gracefulDegradation: true,
      },
    },
  ],
});
```

### Behavior

- `get()` → `null` instead of error
- `set()` → `null` (operation ignored)
- `del()` → `null` (operation ignored)
- All other methods → similar behavior

### Disable Graceful Degradation

To throw errors instead of returning `null`:

```ts
container.get<IConfig>(Types.Config).merge({
  IORedis: [
    {
      name: 'critical',
      options: {
        host: 'localhost',
        port: 6379,
        gracefulDegradation: false,  // ← Throw errors
      },
    },
  ],
});
```

### When Redis is Unavailable

When graceful degradation is enabled:
1. Connection attempt on startup is logged as warning
2. All commands return `null` instead of throwing
3. A warning is logged for each failed command

This allows your application to continue running without Redis (e.g., in development or when Redis is temporarily unavailable).

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
│   │     failoverDetector: true,
│   │     lazyConnect: true,
│   │   })
│   └── await connection.connect()
│
└── connection is a redis: ioredis.Redis
```

### Config Defaults

| Option                | Default    | Notes                                      |
|-----------------------|------------|--------------------------------------------|
| `reconnectTimes`      | `-1`       | Infinite reconnect attempts                |
| `reconnectTimeoutDelta` | `30_000`  | ms between retry attempts                  |
| `reconnectTimeoutLimit` | `30_000`  | max ms between retry attempts              |
| `failoverDetector`    | `true`     | Enable Sentinel failover detection         |

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/ioredis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/ioredis/LICENSE)
