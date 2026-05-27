import { injectable } from '@biorate/inversion';
import { GenericMockConnector } from '../base/mock-connector';
import { ISequelizeConfig } from '@biorate/sequelize';
import { MockSequelizeConnection } from './mock-sequelize-connection';

/**
 * @description Mock Sequelize connector for testing
 *
 * ### Features:
 * - Extends GenericMockConnector
 * - DI-compatible
 * - Multiple connections support
 * - Full Sequelize API simulation
 *
 * @example
 * ```ts
 * const connector = new MockSequelizeConnector();
 * const connection = connector.getMockConnection();
 *
 * connection.setQueryResponse([{ id: 1 }]);
 *
 * const result = await connector.get().query('SELECT * FROM table');
 * ```
 */
@injectable()
export class MockSequelizeConnector extends GenericMockConnector<
  ISequelizeConfig,
  MockSequelizeConnection
> {
  /**
   * @description Namespace for configuration
   */
  protected readonly namespace = 'Sequelize';

  /**
   * @description Create mock connection
   */
  protected createMockConnection(config: ISequelizeConfig): MockSequelizeConnection {
    return new MockSequelizeConnection();
  }

  /**
   * @description Get mock connection
   */
  override getMockConnection(name?: string): MockSequelizeConnection {
    return super.getMockConnection(name);
  }
}
