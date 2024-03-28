# Proxy

Proxy connector

### Features:

- connection manager for simple proxy with/without http liveness probe
- patroni compatible
- stats page

### Examples:

```ts
import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector } from '@biorate/proxy';

const httpPort = 8001;
const clientPort = 7001;
const serverPort = 7002;

export class Root extends Core() {
  public static connect() {
    const socket = new TCPSocket();
    socket.connect(serverPort);
    return socket;
  }

  @inject(ProxyConnector) public connector: ProxyConnector;

  public http: HTTPServer;

  public tcp: TCPServer;

  protected constructor() {
    super();
    this.http = new HTTPServer();
    this.http.listen(httpPort);
    this.http.on('request', (req, res) => {
      res.writeHead(200);
      res.end('1');
    });
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
  Proxy: [
    {
      name: 'connection',
      retry: 10,
      server: {
        address: {
          host: 'localhost',
          port: serverPort,
        },
      },
      clients: [
        {
          liveness: `http://localhost:${httpPort}`,
          address: {
            host: 'localhost',
            port: clientPort,
          },
        },
      ],
    },
  ],
});

(async () => {
  const root = <Root>container.get<Root>(Root);
  await root.$run();
  const socket = Root.connect();
  socket.write('Hello');
  socket.on('data', (data) => {
    console.log(data.toString()); // Hello world!
  });
})();
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/proxy.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/proxy/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
