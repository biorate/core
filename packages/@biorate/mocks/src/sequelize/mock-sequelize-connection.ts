import { MockConnection } from '../base/mock-connection';
import { ResponseBuilder } from '../base/response-builder';
import { SequelizeCall } from './types';
import { MockModel } from './mock-model';
import type { Transaction } from 'sequelize';

/**
 * @description Mock Sequelize connection with full API simulation
 *
 * ### Features:
 * - Query simulation
 * - Model definition
 * - Transaction simulation
 * - Call tracking
 *
 * @example
 * ```ts
 * const connection = new MockSequelizeConnection();
 *
 * connection.setQueryResponse([{ id: 1, name: 'test' }]);
 *
 * const mockModel = connection.define('Test', {});
 * mockModel.setFindAllResponse([{ id: 1 }]);
 *
 * const result = await connection.query('SELECT * FROM test');
 * ```
 */
export class MockSequelizeConnection extends MockConnection<SequelizeCall> {
  /**
   * @description Query response builder
   */
  readonly #queryBuilder: ResponseBuilder<[any[], any]> = new ResponseBuilder();
  /**
   * @description Defined models
   */
  readonly #models: Map<string, MockModel<any>> = new Map();
  /**
   * @description Default query response
   */
  #defaultQueryResponse: [any[], any] | null = null;

  /**
   * @description Set default query response
   */
  setQueryResponse<T = any>(
    data: T[],
    metadata?: any
  ): void {
    this.#defaultQueryResponse = [data, metadata ?? {}];
    this.#queryBuilder.clear();
    this.#queryBuilder.thenReturn([data, metadata ?? {}]);
  }

  /**
   * @description Set query error
   */
  setQueryError(error: Error): void {
    this.#queryBuilder.clear();
    this.#queryBuilder.thenThrow(error);
    this.#defaultQueryResponse = null;
  }

  /**
   * @description Set conditional query response
   */
  whenQuery(
    predicate: (sql: string, options?: any) => boolean
  ): ResponseBuilder<[any[], any]> {
    this.#queryBuilder.when(([sqlOrOptions, options]) => {
      const sql = typeof sqlOrOptions === 'string' ? sqlOrOptions : sqlOrOptions?.query;
      return predicate(sql, options);
    });
    return this.#queryBuilder;
  }

  /**
   * @description Define mock model
   */
  define<T = any>(modelName: string, attributes?: any): MockModel<T> {
    this.trackCall('define', modelName, attributes);
    
    if (!this.#models.has(modelName)) {
      this.#models.set(modelName, new MockModel<T>());
    }
    return this.#models.get(modelName) as MockModel<T>;
  }

  /**
   * @description Get mock model
   */
  getMockModel(modelName: string): MockModel | undefined {
    return this.#models.get(modelName);
  }

  /**
   * @description Get all mock models
   */
  getAllMockModels(): Map<string, MockModel> {
    return new Map(this.#models);
  }

  /**
   * @description Simulate query
   */
  async query(sqlOrOptions: string | any, options?: any): Promise<[any[], any]> {
    await this.applyDelay();
    this.trackCall('query', sqlOrOptions, options);

    try {
      return await this.#queryBuilder.build([sqlOrOptions, options]);
    } catch (e: any) {
      if (this.#defaultQueryResponse !== null) {
        return this.#defaultQueryResponse;
      }
      throw e;
    }
  }

  /**
   * @description Simulate transaction
   */
  async transaction<T>(fn: (t: Transaction) => Promise<T>): Promise<T> {
    this.trackCall('transaction', [fn]);
    
    const mockTransaction = {
      commit: async () => this.trackCall('transaction.commit', []),
      rollback: async () => this.trackCall('transaction.rollback', []),
    } as unknown as Transaction;
    
    return fn(mockTransaction);
  }

  /**
   * @description Simulate sync
   */
  async sync(options?: any): Promise<void> {
    await this.applyDelay();
    this.trackCall('sync', options);
  }

  /**
   * @description Simulate authenticate
   */
  async authenticate(): Promise<void> {
    await this.applyDelay();
    this.trackCall('authenticate');
  }

  /**
   * @description Simulate close
   */
  async close(): Promise<void> {
    await this.applyDelay();
    this.trackCall('close');
  }

  /**
   * @description Reset all configurations
   */
  override reset(): void {
    super.reset();
    this.#queryBuilder.clear();
    this.#models.clear();
    this.#defaultQueryResponse = null;
  }
}
