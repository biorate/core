import { Connector, IConnectorConfig } from '@biorate/connector';
import { MockConnection } from './mock-connection';

/**
 * @description Generic mock connector base class
 *
 * ### Features:
 * - Extends @biorate/connector Connector
 * - Mock connection management
 * - Multiple connections support
 *
 * @example
 * ```ts
 * class MockClickhouseConnector extends GenericMockConnector<
 *   IClickhouseConfig,
 *   MockClickhouseConnection
 * > {
 *   protected createMockConnection(config: IClickhouseConfig) {
 *     return new MockClickhouseConnection();
 *   }
 * }
 * ```
 */
export abstract class GenericMockConnector<
  TConfig extends IConnectorConfig,
  TConnection extends MockConnection
> extends Connector<TConfig, TConnection> {
  /**
   * @description Mock connections storage
   */
  readonly #connections: Map<string, TConnection> = new Map();
  /**
   * @description Current connection
   */
  #current: TConnection | undefined;

  /**
   * @description Abstract method for creating mock connection
   */
  protected abstract createMockConnection(config: TConfig): TConnection;

  /**
   * @description Connect and create mock connection
   */
  protected async connect(config: TConfig): Promise<TConnection> {
    const connection = this.createMockConnection(config);
    this.#connections.set(config.name, connection);
    if (!this.#current) {
      this.#current = connection;
    }
    return connection;
  }

  /**
   * @description Get connection (alias for connection())
   */
  get(name?: string): TConnection {
    return this.connection(name);
  }

  /**
   * @description Get connection by name or current
   */
  connection(name?: string): TConnection {
    const connectionName = name || this.#connections.keys().next().value;
    if (!connectionName) {
      throw new Error('No connections available');
    }
    const connection = this.#connections.get(connectionName);
    if (!connection) {
      throw new Error(`Connection "${connectionName}" not found`);
    }
    return connection;
  }

  /**
   * @description Get or create mock connection by name
   */
  getMockConnection(name?: string): TConnection {
    const connectionName = name || 'default';
    
    // Create connection if it doesn't exist
    if (!this.#connections.has(connectionName)) {
      const config: TConfig = { name: connectionName } as TConfig;
      const connection = this.createMockConnection(config);
      this.#connections.set(connectionName, connection);
      if (!this.#current) {
        this.#current = connection;
      }
    }
    
    return this.#connections.get(connectionName)!;
  }

  /**
   * @description Get all mock connections
   */
  getAllMockConnections(): Map<string, TConnection> {
    return new Map(this.#connections);
  }

  /**
   * @description Reset all mocks
   */
  resetMocks(): void {
    this.#connections.forEach((conn) => conn.reset());
  }

  /**
   * @description Clear all connections
   */
  clearConnections(): void {
    this.#connections.clear();
    this.#current = undefined;
  }

  /**
   * @description Get current connection
   */
  get current(): TConnection | undefined {
    return this.#current;
  }

  /**
   * @description Get all connections
   */
  get connections(): Map<string, TConnection> {
    return new Map(this.#connections);
  }
}
