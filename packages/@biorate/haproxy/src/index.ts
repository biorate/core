import * as HAProxy from 'haproxy';
import { injectable, kill } from '@biorate/inversion';
import { Connector } from '@biorate/connector';
import { path } from '@biorate/tools';
import { tmpdir, EOL } from 'os';
import { unlinkSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import { HaproxyCantConnectError } from './errors';
import { IHaproxyConfig, IHaproxyConnection } from './interfaces';

export * from './errors';
export * from './interfaces';
/**
 * @description Haproxy connector
 *
 * ### Features:
 * - connector manager for haproxy
 *
 * @example
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { HaproxyConnector, HaproxyConfig } from '@biorate/haproxy';
 *
 * class Root extends Core() {
 *   @inject(HaproxyConnector) public connector: HaproxyConnector;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<HaproxyConnector>(HaproxyConnector).toSelf().inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Haproxy: [
 *     {
 *       name: 'connection',
 *       debug: false,
 *       config: {
 *         global: ['maxconn 100'],
 *         defaults: [
 *           'log global',
 *           'retries 2',
 *           'timeout client 30m',
 *           'timeout connect 4s',
 *           'timeout server 30m',
 *           'timeout check 5s',
 *         ],
 *         'listen stats': ['mode http', 'bind *:7001', 'stats enable', 'stats uri /'],
 *         'listen postgres': [
 *           'mode tcp',
 *           'bind *:7000',
 *           'option httpchk',
 *           'http-check expect status 200',
 *           'default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions',
 *           'server postgresql1 127.0.0.1:5433 maxconn 100 check port 8008',
 *           'server postgresql2 127.0.0.1:5434 maxconn 100 check port 8008',
 *           'server postgresql3 127.0.0.1:5435 maxconn 100 check port 8008',
 *         ],
 *       },
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = <Root>container.get<Root>(Root);
 *   await root.$run();
 * })();
 * ```
 */
@injectable()
export class HaproxyConnector extends Connector<IHaproxyConfig, IHaproxyConnection> {
  /**
   * @description config / connection mapping
   */
  #configs = new WeakMap<IHaproxyConnection, IHaproxyConfig>();
  /**
   * @description Private connections storage
   */
  private '#connections': Map<string, IHaproxyConnection>;
  /**
   * @description Private link to selected (used) connection
   */
  private '#current': IHaproxyConnection | undefined;
  /**
   * @description Namespace path for fetching configuration
   */
  protected readonly namespace = 'Haproxy';
  /**
   * @description Create connection
   */
  protected async connect(config: IHaproxyConfig) {
    let connection: IHaproxyConnection;
    try {
      this.cleanup(config);
      const cfgFile = this.createConfig(config);
      connection = new HAProxy(this.path(config, 'sock'), {
        pidFile: this.path(config, 'pid'),
        config: cfgFile,
      });
      for (const method of [
        'start',
        'stop',
        'softstop',
        'reload',
        'verify',
        'running',
        'clear',
        'disable',
        'enable',
        'pause',
        'resume',
        'errors',
        'weight',
        'maxconn',
        'ratelimit',
        'compression',
        'info',
        'session',
        'stat',
      ])
        connection[method] = promisify(connection[method].bind(connection));
      await connection.start();
      this.#configs.set(connection, config);
    } catch (e: unknown) {
      throw new HaproxyCantConnectError(<Error>e);
    }
    return connection;
  }
  /**
   * @description Make path
   */
  protected path(config: IHaproxyConfig, ext: string) {
    return path.create(tmpdir(), `${config.name}.haproxy.${ext}`);
  }
  /**
   * @description Cleanup files
   */
  protected cleanup(config: IHaproxyConfig) {
    try {
      unlinkSync(this.path(config, 'sock'));
    } catch {}
    try {
      unlinkSync(this.path(config, 'pid'));
    } catch {}
    try {
      unlinkSync(this.path(config, 'config'));
    } catch {}
  }
  /**
   * @description Create config file
   */
  protected createConfig(config: IHaproxyConfig) {
    let data = '';
    const file = this.path(config, 'config');
    for (const header in config.config) {
      data += header + EOL;
      if (Array.isArray(config.config[header]))
        for (const field of config.config[header] as string[]) data += '  ' + field + EOL;
      else
        for (const field in config.config[header] as {
          [key: string]: string | number;
        })
          data += '  ' + field + ' ' + config.config[header][field] + EOL;
    }
    writeFileSync(file, data, 'utf-8');
    if (config.debug) console.debug(`Haproxy [${config.name}] config:${EOL}`, data);
    return file;
  }
  /**
   * @description Destructor
   */
  @kill() protected async destructor() {
    for (const [, connection] of this.connections) {
      try {
        await connection.stop();
        this.cleanup(this.#configs.get(connection));
      } catch (e) {
        console.error(e);
      }
    }
  }
}
