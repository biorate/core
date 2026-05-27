import { container, Types } from '@biorate/inversion';
import { IClickhouseConnector } from '@biorate/clickhouse';
import { MockClickhouseConnector } from './mock-clickhouse-connector';

/**
 * @description Options for creating mock ClickHouse connector
 */
export interface MockClickhouseOptions {
  /**
   * @description Connection name (default: 'test')
   */
  name?: string;
  /**
   * @description Setup function for configuring mock
   */
  setup?: (connector: MockClickhouseConnector) => void | Promise<void>;
  /**
   * @description Automatically register in DI container (default: true)
   */
  autoRegister?: boolean;
  /**
   * @description DI container bind type (default: Types.Clickhouse)
   */
  bindType?: symbol;
}

/**
 * @description Create and register MockClickhouseConnector in DI container
 *
 * @param options - Mock options
 * @returns Mock connector instance
 *
 * @example
 * ```ts
 * const connector = createMockClickhouse({
 *   setup: (connector) => {
 *     connector.getMockConnection()
 *       .setQueryResponse([{ id: 1, name: 'test' }]);
 *   }
 * });
 * ```
 */
export function createMockClickhouse(
  options: MockClickhouseOptions = {}
): MockClickhouseConnector {
  const {
    name = 'test',
    setup,
    autoRegister = true,
    bindType = Types.Clickhouse,
  } = options;

  const connector = new MockClickhouseConnector();

  if (setup) {
    const result = setup(connector);
    if (result instanceof Promise) {
      throw new Error(
        'Async setup not supported in createMockClickhouse. ' +
          'Use setupMockClickhouse instead.'
      );
    }
  }

  if (autoRegister) {
    if (container.isBound(bindType)) {
      container.unbind(bindType);
    }
    container.bind<IClickhouseConnector>(bindType).toConstantValue(
      connector as unknown as IClickhouseConnector
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
 * await setupMockClickhouse(async (connector) => {
 *   const connection = connector.getMockConnection();
 *   connection.setQueryResponse([{ id: 1 }]);
 * });
 * ```
 */
export async function setupMockClickhouse(
  setupFn: (connector: MockClickhouseConnector) => void | Promise<void>,
  options: Omit<MockClickhouseOptions, 'setup'> = {}
): Promise<MockClickhouseConnector> {
  const { autoRegister = true, bindType = Types.Clickhouse } = options;

  const connector = new MockClickhouseConnector();

  await setupFn(connector);

  if (autoRegister) {
    if (container.isBound(bindType)) {
      container.unbind(bindType);
    }
    container.bind<IClickhouseConnector>(bindType).toConstantValue(
      connector as unknown as IClickhouseConnector
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
 *   useMockClickhouse((connector) => {
 *     connector.getMockConnection()
 *       .setQueryResponse([{ id: 1 }]);
 *   });
 * });
 * ```
 */
export function useMockClickhouse(
  setupFn?: (connector: MockClickhouseConnector) => void | Promise<void>
): MockClickhouseConnector {
  return createMockClickhouse({ setup: setupFn });
}
