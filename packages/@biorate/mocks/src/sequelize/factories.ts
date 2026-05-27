import { container, Types } from '@biorate/inversion';
import { ISequelizeConnector } from '@biorate/sequelize';
import { MockSequelizeConnector } from './mock-sequelize-connector';

/**
 * @description Options for creating mock Sequelize connector
 */
export interface MockSequelizeOptions {
  /**
   * @description Connection name (default: 'test')
   */
  name?: string;
  /**
   * @description Setup function for configuring mock
   */
  setup?: (connector: MockSequelizeConnector) => void | Promise<void>;
  /**
   * @description Automatically register in DI container (default: true)
   */
  autoRegister?: boolean;
  /**
   * @description DI container bind type (default: Types.Sequelize)
   */
  bindType?: symbol;
}

/**
 * @description Create and register MockSequelizeConnector in DI container
 *
 * @param options - Mock options
 * @returns Mock connector instance
 *
 * @example
 * ```ts
 * const connector = createMockSequelize({
 *   setup: (connector) => {
 *     connector.getMockConnection()
 *       .setQueryResponse([{ id: 1, name: 'test' }]);
 *   }
 * });
 * ```
 */
export function createMockSequelize(
  options: MockSequelizeOptions = {}
): MockSequelizeConnector {
  const {
    name = 'test',
    setup,
    autoRegister = true,
    bindType = Types.Sequelize,
  } = options;

  const connector = new MockSequelizeConnector();

  if (setup) {
    const result = setup(connector);
    if (result instanceof Promise) {
      throw new Error(
        'Async setup not supported in createMockSequelize. ' +
          'Use setupMockSequelize instead.'
      );
    }
  }

  if (autoRegister) {
    if (container.isBound(bindType)) {
      container.unbind(bindType);
    }
    container.bind<ISequelizeConnector>(bindType).toConstantValue(
      connector as unknown as ISequelizeConnector
    );
  }

  return connector;
}

/**
 * @description Async version for complex setup
 *
 * @param setupFn - Async setup function
 * @param options - Options
 * @returns Mock connector instance
 *
 * @example
 * ```ts
 * await setupMockSequelize(async (connector) => {
 *   const connection = connector.getMockConnection();
 *   const mockModel = connection.define('User');
 *   mockModel.setFindAllResponse([{ id: 1, name: 'Alice' }]);
 * });
 * ```
 */
export async function setupMockSequelize(
  setupFn: (connector: MockSequelizeConnector) => void | Promise<void>,
  options: Omit<MockSequelizeOptions, 'setup'> = {}
): Promise<MockSequelizeConnector> {
  const { autoRegister = true, bindType = Types.Sequelize } = options;

  const connector = new MockSequelizeConnector();

  await setupFn(connector);

  if (autoRegister) {
    if (container.isBound(bindType)) {
      container.unbind(bindType);
    }
    container.bind<ISequelizeConnector>(bindType).toConstantValue(
      connector as unknown as ISequelizeConnector
    );
  }

  return connector;
}

/**
 * @description Helper for quick usage in beforeEach
 *
 * @param setupFn - Setup function
 * @returns Mock connector instance
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   useMockSequelize((connector) => {
 *     connector.getMockConnection()
 *       .setQueryResponse([{ id: 1 }]);
 *   });
 * });
 * ```
 */
export function useMockSequelize(
  setupFn?: (connector: MockSequelizeConnector) => void | Promise<void>
): MockSequelizeConnector {
  return createMockSequelize({ setup: setupFn });
}
