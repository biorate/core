# @biorate/redis

Redis connector — connection manager for `ioredis` with multi-connection support.

## Features

- **Auto-connect** — creates `ioredis.Redis` client on `@init()` via config namespace `Redis`.
- **Full Redis API** — all 5.x commands via the standard `ioredis` interface.
- **Multi-connection** — named connection support.
- **Typed errors** — `RedisCantConnectError` on connection failure.

## Installation

```bash
pnpm add @biorate/redis
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `ioredis@5`.

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
  Redis: [{
    name: 'connection',
    options: { host: 'localhost', port: 6379 },
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  await root.connector.current!.set('key', 'value');
  const result = await root.connector.current!.get('key');
  console.log(result); // 'value'
})();
```

## API Reference

### `RedisConnector`

| Member           | Type                                      | Description                              |
|------------------|-------------------------------------------|------------------------------------------|
| `namespace`      | `'Redis'`                                 | Config key for connection definitions.   |
| `connect(config)` | `(config) => Promise<Redis>`             | Creates `new Redis(config.options)`.     |

### Config

```ts
interface IRedisConfig extends IConnectorConfig {
  options: RedisOptions;  // host, port, password, db, etc.
}
```

### Errors

| Error                    | Condition                                    |
|--------------------------|----------------------------------------------|
| `RedisCantConnectError`  | `new Redis()` or initial connection fails.   |

## Architecture

```
RedisConnector extends Connector<IRedisConfig, Redis>
│
├── namespace = 'Redis'
├── connect(config) → new Redis(config.options)
└── connection is an ioredis.Redis instance
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/redis.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/redis/LICENSE)
