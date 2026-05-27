/**
 * @description Universal mocking utilities for @biorate connectors
 *
 * ### Features:
 * - Generic base classes for all connectors
 * - Vitest spies integration for call tracking
 * - Fluent API for response configuration
 * - Async iterable support for cursors/streams
 * - DI container integration
 * - Type-safe mocks
 *
 * @example
 * ```ts
 * import { setupMockClickhouse } from '@biorate/mocks/clickhouse';
 *
 * describe('MyService', () => {
 *   it('should work', async () => {
 *     await setupMockClickhouse((connector) => {
 *       connector.getMockConnection()
 *         .setQueryResponse([{ id: 1, name: 'test' }]);
 *     });
 *
 *     const service = container.get(MyService);
 *     const result = await service.getData();
 *     expect(result).toEqual([{ id: 1, name: 'test' }]);
 *   });
 * });
 * ```
 */

export * from './base';
export {
  MockClickhouseConnector,
  MockClickhouseConnection,
  createMockClickhouse,
  setupMockClickhouse,
  useMockClickhouse,
} from './clickhouse';
export {
  MockSequelizeConnector,
  MockSequelizeConnection,
  MockModel,
  createMockSequelize,
  setupMockSequelize,
  useMockSequelize,
} from './sequelize';
