import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { Server as HTTPServer } from 'http';
import { Server as TCPServer } from 'net';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { IPrometheus, Prometheus } from '@biorate/prometheus';
import { SnapshotStore, MODE_REPLAY } from '../src';
import { ProxyConnector } from './__mocks__/proxy-prometheus';

const httpPort = 28001;
const clientPort = 27001;
const serverPort = 27002;

let http: HTTPServer | undefined;
let tcp: TCPServer | undefined;

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();

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
});

afterAll(() => {
  http?.close();
  tcp?.close();
  for (const c of [ProxyConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/proxy-prometheus', () => {
  it('proxy-prometheus connector', async () => {
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

    if (!container.isBound(Prometheus))
      container.bind<IPrometheus>(Prometheus).to(Prometheus).inSingletonScope();
    container.bind(ProxyConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(Prometheus) public prometheus: IPrometheus;
      @inject(ProxyConnector) public connector: ProxyConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const conn = root.connector.get();
    expect(conn).toBeDefined();

    container.unbind(Root);
  });
});
