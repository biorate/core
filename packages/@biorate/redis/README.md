# @biorate/redis

Redis connector — connection manager for `node-redis` with multi-connection support.

## Features

- **Auto-connect** — creates a `node-redis` client via `createClient()` on `@init()` through config namespace `Redis`.
- **Full Redis API** — the connection exposes the `node-redis` client directly (v4+ command interface).
- **Multi-connection** — named connection support.
- **Typed errors** — `RedisCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/redis
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/errors`, `@biorate/tools`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RedisConnector } from '@biorate/redis';

class Root extends Core() {
  @inject(RedisConnector) public connector: RedisConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RedisConnector>(RedisConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Redis: [
    {
      name: 'connection',
      options: {
        url: 'redis://localhost:6379',
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.set('key', 'value');
  const result = await root.connector.current!.get('key');
  console.log(result); // 'value'
})();
```

The `options` object accepts the `node-redis` `RedisClientOptions` shape — either a `url` string or the v4 `socket` options:

```ts
options: {
  socket: { host: 'localhost', port: 6379 },
},
```

## API Reference

### `RedisConnector`

| Member            | Type                                    | Description                            |
| ----------------- | --------------------------------------- | -------------------------------------- |
| `namespace`       | `'Redis'`                               | Config key for connection definitions. |
| `connect(config)` | `(config) => Promise<IRedisConnection>` | Creates `createClient()` and connects. |

The `current`/`connection()` accessors return the `node-redis` client (`IRedisConnection`).

### Config

```ts
interface IRedisConfig extends IConnectorConfig {
  host: string;
  options: RedisClientOptions; // url or node-redis v4 socket/options
}

type IRedisConnection = ReturnType<typeof createClient>;
```

### Errors

| Error                   | Condition                                     |
| ----------------------- | --------------------------------------------- |
| `RedisCantConnectError` | `createClient()` or initial connection fails. |

## Architecture

```
RedisConnector extends Connector<IRedisConfig, IRedisConnection>
│
├── namespace = 'Redis'
├── connect(config) → createClient(config.options) + await connection.connect()
└── connection is a node-redis client instance
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/redis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/LICENSE)
