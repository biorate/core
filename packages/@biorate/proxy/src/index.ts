import { injectable } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { ProxyCantConnectError } from './errors';
import { ProxyConnection } from './connection';
import { IProxyConfig, IProxyConnection } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Proxy connector
 *
 * ### Features:
 * - connection manager for simple proxy with/without http liveness probe
 * - patroni compatible
 *
 * @example
 * ```
 * import { Server as HTTPServer } from 'http';
 * import { Server as TCPServer } from 'net';
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { ProxyConnector } from '@biorate/proxy';
 *
 * const httpPort = 8001;
 * const clientPort = 7001;
 * const serverPort = 7002;
 *
 * export class Root extends Core() {
 *   public static connect() {
 *     const socket = new TCPSocket();
 *     socket.connect(serverPort);
 *     return socket;
 *   }
 *
 *   @inject(ProxyConnector) public connector: ProxyConnector;
 *
 *   public http: HTTPServer;
 *
 *   public tcp: TCPServer;
 *
 *   protected constructor() {
 *     super();
 *     this.http = new HTTPServer();
 *     this.http.listen(httpPort);
 *     this.http.on('request', (req, res) => {
 *       res.writeHead(200);
 *       res.end('1');
 *     });
 *     this.tcp = new TCPServer();
 *     this.tcp.listen(clientPort);
 *     this.tcp.on('connection', (socket) =>
 *       socket.on('data', (data) => socket.write(`${data} world!`)),
 *     );
 *   }
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ProxyConnector>(ProxyConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Proxy: [
 *     {
 *       name: 'connection',
 *       retry: 10,
 *       server: {
 *         address: {
 *           host: 'localhost',
 *           port: serverPort,
 *         },
 *       },
 *       clients: [
 *         {
 *           liveness: `http://localhost:${httpPort}`,
 *           address: {
 *             host: 'localhost',
 *             port: clientPort,
 *           },
 *         },
 *       ],
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = <Root>container.get<Root>(Root);
 *   await root.$run();
 *   const socket = Root.connect();
 *   socket.write('Hello');
 *   socket.on('data', (data) => {
 *     console.log(data.toString()); // Hello world!
 *   });
 * })();
 * ```
 */
@injectable()
export class ProxyConnector extends Connector<IProxyConfig, IProxyConnection> {
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IProxyConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IProxyConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Proxy';
  /**
   * @description Create connection
   */
  protected async connect(config: IProxyConfig) {
    let connection: IProxyConnection;
    try {
      connection = await ProxyConnection.create(config);
    } catch (e: unknown) {
      throw new ProxyCantConnectError(<Error>e);
    }
    return connection;
  }
}
