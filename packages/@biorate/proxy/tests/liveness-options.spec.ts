import { Server as HTTPServer } from 'http';
import { Server as TCPServer, Socket as TCPSocket } from 'net';
import { afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ProxyConnector } from '../src';

// A stalling upstream: accepts the TCP connection but never responds, so an axios
// liveness probe on it hangs until the axios `timeout` fires (default 15s).
const stallHttpPort = 8012;
const stallClientPort = 7013;
const liveHttpPort = 8011;
const liveClientPort = 7011;
const serverPort = 7012;

const stallSockets = new Set<TCPSocket>();
const stallHttp = new TCPServer((socket) => {
  stallSockets.add(socket);
  socket.on('error', () => {});
  socket.on('close', () => stallSockets.delete(socket));
});
stallHttp.listen(stallHttpPort);

export class LivenessOptionsRoot extends Core() {
  @inject(ProxyConnector) public connector: ProxyConnector;

  public http: HTTPServer;

  public tcp: TCPServer;

  protected constructor() {
    super();
    this.http = new HTTPServer();
    this.http.listen(liveHttpPort);
    this.http.on('request', (req, res) => {
      res.writeHead(200);
      res.end('1');
    });
    this.tcp = new TCPServer();
    this.tcp.listen(liveClientPort);
    this.tcp.on('connection', (socket) =>
      socket.on('data', (data) => socket.write(`${data} world!`)),
    );
  }
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<ProxyConnector>(ProxyConnector).toSelf().inSingletonScope();
container.bind<LivenessOptionsRoot>(LivenessOptionsRoot).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Proxy: [
    {
      name: 'liveness-options',
      retry: 10,
      // If `livenessOptions` were not honored (or defaulted to 15s), this test would
      // take ~15s on the stalling first client. With timeout 100 it must be fast.
      livenessOptions: { timeout: 100 },
      server: {
        address: {
          host: 'localhost',
          port: serverPort,
        },
      },
      clients: [
        {
          liveness: `http://localhost:${stallHttpPort}`,
          address: {
            host: 'localhost',
            port: stallClientPort,
          },
        },
        {
          liveness: `http://localhost:${liveHttpPort}`,
          address: {
            host: 'localhost',
            port: liveClientPort,
          },
        },
      ],
    },
  ],
});

afterAll(() => {
  for (const socket of stallSockets) socket.destroy();
  stallSockets.clear();
  stallHttp.close();
});

describe('@biorate/proxy livenessOptions', () => {
  it('fails over from a stalling upstream within the configured timeout', async () => {
    const root = container.get<LivenessOptionsRoot>(LivenessOptionsRoot);
    const start = Date.now();
    await root.$run();
    const elapsed = Date.now() - start;
    // Far below the default 15s probe timeout — proves the 100ms override took effect.
    expect(elapsed).toBeLessThan(5000);
    // The failed (stalled) upstream must lose the selection to the live one.
    await new Promise<void>((done) => {
      const socket = new TCPSocket();
      socket.connect(serverPort);
      socket.write('Hello');
      socket.on('data', (data) => {
        expect(data.toString()).toBe('Hello world!');
        socket.destroy();
        done();
      });
      socket.on('error', () => {
        socket.destroy();
        done();
      });
    });
  });
});
