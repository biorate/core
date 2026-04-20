import { Server as HTTPServer } from 'http';
import { Server as TCPServer, Socket as TCPSocket } from 'net';
import { init, inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector } from '../../src';

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
  ProxyStats: {
    enabled: true,
    port: 8765,
  },
  Proxy: [
    {
      retry: 10,
      name: 'test',
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
        {
          liveness: `http://localhost:8002`,
          address: {
            host: 'localhost',
            port: 7003,
          },
        },
        {
          liveness: `http://localhost:8003`,
          address: {
            host: 'localhost',
            port: 7004,
          },
        },
      ],
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
