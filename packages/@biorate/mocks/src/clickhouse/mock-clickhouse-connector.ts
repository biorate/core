import { injectable } from '@biorate/inversion';
import { GenericMockConnector } from '../base/mock-connector';
import { IClickhouseConfig } from '@biorate/clickhouse';
import { MockClickhouseConnection } from './mock-clickhouse-connection';

/**
 * @description Mock ClickHouse connector for testing
 *
 * ### Features:
 * - Extends GenericMockConnector
 * - DI-compatible
 * - Multiple connections support
 * - Full ClickHouse API simulation
 *
 * @example
 * ```ts
 * const connector = new MockClickhouseConnector();
 * const connection = connector.getMockConnection();
 *
 * connection.setQueryResponse([{ id: 1, name: 'test' }]);
 *
 * // Use connection
 * const result = await connector.get().query({ query: 'SELECT * FROM table' });
 * const { data } = await result.json();
 * ```
 */
@injectable()
export class MockClickhouseConnector extends GenericMockConnector<
  IClickhouseConfig,
  MockClickhouseConnection
> {
  /**
   * @description Namespace for configuration
   */
  protected readonly namespace = 'Clickhouse';

  /**
   * @description Create mock connection
   */
  protected createMockConnection(config: IClickhouseConfig): MockClickhouseConnection {
    return new MockClickhouseConnection();
  }

  /**
   * @description Get mock connection
   */
  override getMockConnection(name?: string): MockClickhouseConnection {
    return super.getMockConnection(name);
  }
}
