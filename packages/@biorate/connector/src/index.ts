import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { IConnector, IConnectorConfig } from './interfaces';
import {
  ConnectorConnectionNotExistsError,
  ConnectorEmptyConnectionsError,
} from './errors';
export * from './errors';
export * from './interfaces';

/**
 * @description Connector interface
 *
 * ### Features:
 * - Common interface for all connectors
 *
 * @example
 * ```
 * import { Connector, IConnector } from '../..';
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 *
 * export class Connection {
 *   public name: string;
 *
 *   public constructor(name: string) {
 *     this.name = name;
 *   }
 * }
 *
 * export class TestConnector extends Connector<{ name: string }, Connection> {
 *   protected namespace = 'TestConnector';
 *
 *   protected async connect(config) {
 *     return new Connection(config.name);
 *   }
 * }
 *
 * export class Root extends Core() {
 *   @inject(TestConnector) public connector: IConnector<{ name: string }, Connection>;
 * }
 *
 * container.bind(Types.Config).to(Config).inSingletonScope();
 * container.bind(TestConnector).toSelf().inSingletonScope();
 * container.bind(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   TestConnector: [{ name: 'test-connection' }],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   console.log(root.connector.connection('test-connection')); // Connection { name: 'test-connection' }
 * })();
 * ```
 */
@injectable()
export abstract class Connector<C extends IConnectorConfig, T = unknown>
  implements IConnector<C, T>
{
  /**
   * @description Private connections storage
   */
  #connections = new Map<string, T>();
  /**
   * @description Private link to selected (used) connection
   */
  #current: T | undefined = undefined;
  /**
   * @description Config dependency
   */
  @inject(Types.Config) protected config: IConfig;
  /**
   * @description Namespace path for fetching configuration
   */
  protected abstract readonly namespace: string;
  /**
   * @description Connections storage
   */
  public get connections() {
    return this.#connections;
  }
  /**
   * @description Link to selected (used) connection
   */
  public get current() {
    return this.#current;
  }
  /**
   * @description Abstract method describing connection
   */
  protected abstract connect(config: C): Promise<T>;
  /**
   * @description Method for change current connection
   */
  public use(name: string) {
    if (!this.#connections.has(name))
      throw new ConnectorConnectionNotExistsError(this.constructor.name, name);
    this.#current = this.#connections.get(name);
  }
  /**
   * @description Method for get existed the connection
   */
  public connection(name?: string): T {
    if (!this.#connections.size)
      throw new ConnectorEmptyConnectionsError(this.constructor.name);
    if (!name) return <T>this.#current;
    if (!this.#connections.has(name))
      throw new ConnectorConnectionNotExistsError(this.constructor.name, name);
    return <T>this.#connections.get(name);
  }
  /**
   * @description Alias for connection method
   */
  public get(name?: string) {
    return this.connection(name);
  }
  /**
   * @description Initialize method
   */
  @init() protected async initialize() {
    for (const config of this.config.get<C[]>(this.namespace, [])) {
      this.#connections.set(config.name, await this.connect(config));
      if (!this.#current) this.#current = this.#connections.get(config.name);
    }
  }
}
