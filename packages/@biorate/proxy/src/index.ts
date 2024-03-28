import { createServer } from 'http';
import { compile } from 'pug';
import { readFileSync } from 'fs';
import { path } from '@biorate/tools';
import { init, injectable } from '@biorate/inversion';
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
 * - stats page
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
  /**
   * @description stats server enable
   */
  protected stats() {
    let { enabled, port, host } = this.config.get<{
      enabled?: boolean;
      port: number;
      host?: string;
    }>('ProxyStats', {
      enabled: false,
      port: 0,
      host: 'localhost',
    });
    if (!enabled) return;
    port = port ?? 0;
    const template = readFileSync(path.create(__dirname, '..', 'index.pug'), 'utf-8');
    const compiled = compile(template);
    const configs = this.config.get<IProxyConfig[]>(this.namespace, []);
    const server = createServer((req, res) => {
      res.setHeader('content-type', 'text/html; charset=UTF-8');
      res.end(compiled(this.#getStatData(configs)));
    }).listen({ port: port ?? 0, host });
    server.on('listening', () => {
      const attr = <{ address: string; port: number }>server.address();
      console.debug(`ProxyStats server listened on [${attr.address}:${port}]`);
    });
  }
  /**
   * @description Get stat data
   */
  #getStatData = (configs: IProxyConfig[]) => {
    const locals: {
      rows: {
        connection: string;
        backendHost: string;
        proxyHost: string;
        active: boolean;
        writed: number;
        readed: number;
      }[];
    } = { rows: [] };
    for (const config of configs) {
      for (const client of config.clients) {
        const connection = this.get(config.name);
        const isActive = connection ? connection.isActive(client) : false;
        const stat = isActive ? connection.stat : { writed: 0, readed: 0 };
        locals.rows.push({
          connection: config.name,
          proxyHost:
            config.server.address.path ??
            `${config.server.address.host}:${config.server.address.port}`,
          backendHost: `${client.address.host}:${client.address.port}`,
          active: isActive,
          ...stat,
        });
      }
    }
    return locals;
  };
  /**
   * @description initialize
   */
  @init() protected async initialize() {
    await super.initialize();
    this.stats();
  }
}
