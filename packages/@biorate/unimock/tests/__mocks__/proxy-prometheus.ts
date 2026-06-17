import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core, init } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IPrometheus, Prometheus } from '@biorate/prometheus';
import { ProxyConnector as RawProxyConnector } from '@biorate/proxy-prometheus';
import { SnapshotStore, MODE_REPLAY } from '../../src';
import { Mockable } from '../../src';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  @init() protected async initialize() {
    await super.initialize();
  }

  protected stats() {
    // no-op: prevent second this.config access during initialize
  }

  protected metrics = async () => {};
}

export const httpPort = 28001;
export const clientPort = 27001;
export const serverPort = 27002;

let http: HTTPServer | undefined;
let tcp: TCPServer | undefined;

export function startServers() {
  if (SnapshotStore.mode !== MODE_REPLAY) {
    http = new HTTPServer();
    http.listen(httpPort);
    http.on('request', (req, res) => {
      res.writeHead(200);
      res.end('1');
    });

    tcp = new TCPServer();
    tcp.listen(clientPort);
    tcp.on('connection', (socket) =>
      socket.on('data', (data) => socket.write(`${data} world!`)),
    );
  }
}

export function stopServers() {
  http?.close();
  tcp?.close();
}

class Root extends Core() {
  @inject(Prometheus) public prometheus: IPrometheus;
  @inject(ProxyConnector) public connector: ProxyConnector;
}

const config = {
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
};

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  if (!container.isBound(Prometheus))
    container.bind<IPrometheus>(Prometheus).to(Prometheus).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(ProxyConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: ProxyConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(ProxyConnector)) container.unbind(ProxyConnector);
}
