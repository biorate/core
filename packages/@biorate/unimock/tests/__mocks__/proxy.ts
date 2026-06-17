import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector as RawProxyConnector } from '@biorate/proxy';
import { SnapshotStore, MODE_REPLAY } from '../../src';
import { Mockable } from '../../src';

@Mockable({})
export class ProxyConnector extends RawProxyConnector {
  protected stats() {
    // no-op: prevent second this.config access during initialize
    // that would overwrite the config getter snapshot refId
  }
}

export const httpPort = 18101;
export const clientPort = 17101;
export const serverPort = 17102;

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
