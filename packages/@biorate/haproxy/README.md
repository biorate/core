# @biorate/haproxy

HAProxy connector — programmatic HAProxy lifecycle management via the `haproxy` npm package.

## Features

- **Config generation** — creates HAProxy config files from a structured TypeScript config.
- **Full lifecycle** — `start()`, `stop()`, `softstop()`, `reload()`, `verify()`, `running()`.
- **Readiness checks** — polls HAProxy stats until all nodes report `UP`.
- **Auto-cleanup** — removes socket, PID, and config files on shutdown.
- **Promisified API** — all HAProxy methods wrapped with `util.promisify`.
- **@kill() destructor** — stops all connections on process exit.

## Installation

```bash
pnpm add @biorate/haproxy
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/tools`, `haproxy`.

## Quick start

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { HaproxyConnector } from '@biorate/haproxy';

class Root extends Core() {
  @inject(HaproxyConnector) public connector: HaproxyConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<HaproxyConnector>(HaproxyConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Haproxy: [
    {
      name: 'pg-cluster',
      debug: false,
      readiness: {
        nodes: ['postgresql1', 'postgresql2'],
        retries: 10,
        delay: 1000,
      },
      config: {
        global: [
          'maxconn 100',
          'stats socket {{stat_socket_path}} mode 660 level admin',
        ],
        defaults: ['timeout client 30m', 'timeout connect 4s', 'timeout server 30m'],
        'listen postgres': [
          'mode tcp',
          'bind *:7000',
          'server postgresql1 127.0.0.1:5433 check',
          'server postgresql2 127.0.0.1:5434 check',
        ],
      },
    },
  ],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  // HAProxy is now running with the configured backends
})();
```

## API Reference

### `HaproxyConnector`

| Member            | Type                                    | Description                                       |
|-------------------|-----------------------------------------|---------------------------------------------------|
| `namespace`       | `'Haproxy'`                             | Config key.                                       |
| `connect(config)` | `(config) => Promise<IHaproxyConnection>` | Creates config file, starts HAProxy, waits for readiness. |
| `@kill()` destructor | `() => Promise<void>`                  | Stops all connections and cleans up files.        |

### Connection (promisified HAProxy API)

| Method        | Description                                  |
|---------------|----------------------------------------------|
| `start()`     | Start HAProxy process.                       |
| `stop()`      | Stop HAProxy.                                |
| `softstop()`  | Graceful stop (existing connections drain).  |
| `reload()`    | Reload configuration.                        |
| `verify()`    | Verify config file syntax.                   |
| `running()`   | Check if HAProxy is running.                 |
| `disable()`   | Disable a server in a backend.               |
| `enable()`    | Enable a server in a backend.                |
| `stat()`      | Get stats table.                             |
| `info()`      | Get HAProxy info.                            |
| ...           | Full list in `IHaproxyConnection` interface. |

### Config

```ts
interface IHaproxyConfig extends IConnectorConfig {
  config: {
    [section: string]: string[] | { [key: string]: string | number };
  };
  readiness?: {
    nodes?: string[];      // server names to wait for
    retries?: number;       // default 10
    delay?: number;         // ms between polls, default 1000
  };
  debug?: boolean;          // print generated config
}
```

### Errors

| Error                          | Condition                                        |
|--------------------------------|--------------------------------------------------|
| `HaproxyCantConnectError`      | HAProxy process fails to start.                  |
| `HaproxyConnectionTimeoutError`| Readiness nodes did not reach `UP` in time.      |

## Architecture

```
HaproxyConnector extends Connector<IHaproxyConfig, IHaproxyConnection>
│
├── namespace = 'Haproxy'
├── connect(config)
│   ├── cleanup() — remove old sock/pid/config files
│   ├── createConfig() — write haproxy.cfg from config object
│   │   └── {{stat_socket_path}} replaced with temp path
│   ├── new HAProxy(sockPath, { pidFile, config })
│   ├── promisify all methods
│   ├── connection.start()
│   ├── readiness() — poll stat() until all nodes UP
│   └── store config in WeakMap for cleanup
│
├── @kill() destructor
│   └── for each connection: stop() + cleanup()
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/haproxy.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/haproxy/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/haproxy/LICENSE)
