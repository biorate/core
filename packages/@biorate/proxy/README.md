# @biorate/proxy

TCP proxy connector — lightweight, configurable TCP load balancer with liveness checks and connection failover.

## Features

- **TCP proxy** — listens on a local port, forwards connections to a selected upstream.
- **Client failover** — automatically selects healthy upstreams based on HTTP liveness probes (Patroni-compatible).
- **Health checks** — periodic liveness polling; switches upstream on failure.
- **Unix socket support** — listen on Unix domain sockets.
- **Stats page** — optional HTTP server with Pug-rendered connection statistics.
- **@kill() destructor** — graceful cleanup on shutdown.

## Installation

```bash
pnpm add @biorate/proxy
```

Requires `@biorate/connector`, `@biorate/inversion`, `@biorate/config`, `@biorate/tools`, `@biorate/axios`, `pug`.

## Quick start

```ts
import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector } from '@biorate/proxy';

const httpPort = 8001;
const clientPort = 7001;
const serverPort = 7002;

class Root extends Core() {
  @inject(ProxyConnector) public connector: ProxyConnector;
  public http: HTTPServer;
  public tcp: TCPServer;

  protected constructor() {
    super();
    this.http = new HTTPServer();
    this.http.listen(httpPort);
    this.http.on('request', (req, res) => { res.writeHead(200); res.end('1'); });
    this.tcp = new TCPServer();
    this.tcp.listen(clientPort);
    this.tcp.on('connection', (socket) =>
      socket.on('data', (data) => socket.write(`${data} world!`)),
    );
  }
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ProxyConnector>(ProxyConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Proxy: [{
    name: 'connection',
    retry: 10,
    server: { address: { host: 'localhost', port: serverPort } },
    clients: [{
      liveness: `http://localhost:${httpPort}`,
      address: { host: 'localhost', port: clientPort },
    }],
  }],
});

(async () => {
  const root = container.get<Root>(Root);
  await root.$run();
  const { Socket } = await import('net');
  const socket = new Socket();
  socket.connect(serverPort);
  socket.write('Hello');
  socket.on('data', (data) => console.log(data.toString())); // 'Hello world!'
})();
```

## API Reference

### `ProxyConnector`

| Member              | Type                                      | Description                                   |
|---------------------|-------------------------------------------|-----------------------------------------------|
| `namespace`         | `'Proxy'`                                 | Config key for connection definitions.        |
| `connect(config)`   | `(config) => Promise<IProxyConnection>`    | Creates `ProxyConnection` with client selection. |
| `stats()`           | `() => void`                              | Starts optional HTTP stats server.            |
| `getStatData()`     | `() => object[]`                           | Returns active connection stats for rendering. |

### Config

```ts
interface IProxyConfig extends IConnectorConfig {
  retry?: number;            // max retries for client selection (default 10)
  timeout?: number;          // ms between selection attempts (default 1000)
  checkInterval?: number;    // ms between health checks (< 0 = disabled)
  server: {
    options?: ServerOpts;
    address: ListenOptions;  // { host, port } or { path: '/tmp/sock' }
  };
  clients: IClientOption[];  // upstream backends
}

interface IClientOption {
  liveness?: string;         // HTTP URL for health check
  address: TcpSocketConnectOpts;
  options?: SocketConstructorOpts;
}
```

Additional `ProxyStats` config:

```ts
ProxyStats: {
  enabled?: boolean;      // default false
  port: number;
  host?: string;          // default 'localhost'
}
```

### Errors

| Error                          | Condition                                        |
|--------------------------------|--------------------------------------------------|
| `ProxyCantConnectError`        | Proxy connection creation fails.                 |
| `ProxyConnectionTimeoutError`  | No healthy upstream selected within retry limit. |

## Architecture

```
ProxyConnector extends Connector<IProxyConfig, IProxyConnection>
│
├── namespace = 'Proxy'
├── connect(config)
│   └── ProxyConnection.create(config)
│       ├── select() → iterate clients, ping liveness, pick first healthy
│       ├── listen() → create TCP server, pipe sockets
│       └── check() → periodic health re-evaluation
│
├── @init() initialize()
│   ├── super.initialize() — create connections
│   └── stats() — optional HTTP stats server
│
└── ProxyConnection
    ├── server: Server (TCP listener)
    ├── client: IClientOption (selected upstream)
    ├── select() — liveness-based failover
    ├── listen() — accept connections, proxy TCP
    ├── check() — background health polling
    ├── isActive(client) — check if client is current
    └── stat — { read, write } byte counters
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/proxy.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy/CHANGELOG.md)

## License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy/LICENSE)
