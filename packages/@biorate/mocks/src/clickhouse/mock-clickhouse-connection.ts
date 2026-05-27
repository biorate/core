import { MockConnection } from '../base/mock-connection';
import { ResponseBuilder } from '../base/response-builder';
import { MockQueryResult } from '../base/async-iterable';
import { 
  ClickHouseCall, 
  QueryResponseOptions, 
  InsertResponseOptions,
  QueryParams,
  InsertParams,
  CommandParams,
  InsertResult
} from './types';

/**
 * @description Mock ClickHouse connection with full API simulation
 *
 * ### Features:
 * - Query simulation with configurable responses
 * - Insert simulation
 * - Command simulation
 * - Call tracking
 * - Conditional responses
 * - Sequential responses
 * - Error simulation
 * - Delay simulation
 *
 * @example
 * ```ts
 * const connection = new MockClickhouseConnection();
 *
 * // Simple response
 * connection.setQueryResponse([{ id: 1, name: 'test' }]);
 *
 * // Conditional response
 * connection
 *   .whenQuery(q => q.includes('users'))
 *   .thenReturn([{ id: 1, name: 'Alice' }]);
 *
 * // Sequential responses
 * connection.setQuerySequence([
 *   [{ id: 1 }],  // first call
 *   [{ id: 2 }]   // second call
 * ]);
 *
 * // Error simulation
 * connection.setQueryError(new Error('Database error'));
 *
 * // Use in query
 * const result = await connection.query({ query: 'SELECT * FROM table' });
 * const { data } = await result.json();
 *
 * // Check calls
 * expect(connection.wasCalled('query')).toBe(true);
 * expect(connection.getCallCount('query')).toBe(1);
 * ```
 */
export class MockClickhouseConnection extends MockConnection<ClickHouseCall> {
  /**
   * @description Query response builder
   */
  readonly #queryBuilder: ResponseBuilder<MockQueryResult<any>> = new ResponseBuilder();
  /**
   * @description Insert response builder
   */
  readonly #insertBuilder: ResponseBuilder<InsertResult> = new ResponseBuilder();
  /**
   * @description Command response builder
   */
  readonly #commandBuilder: ResponseBuilder<{ query_id: string }> = new ResponseBuilder();
  /**
   * @description Default query response data
   */
  #defaultQueryData: any[] | null = null;
  /**
   * @description Default insert response
   */
  #defaultInsertResponse: InsertResult | null = null;
  /**
   * @description Default command response
   */
  #defaultCommandResponse: { query_id: string } | null = null;

  /**
   * @description Set default query response
   */
  setQueryResponse<T>(data: T[], options?: QueryResponseOptions): MockQueryResult<T> {
    this.#defaultQueryData = data;
    const result = new MockQueryResult<T>(data, options);
    this.#queryBuilder.clear();
    this.#queryBuilder.thenReturn(result);
    return result;
  }

  /**
   * @description Set query error
   */
  setQueryError(error: Error): void {
    this.#queryBuilder.clear();
    this.#queryBuilder.thenThrow(error);
    this.#defaultQueryData = null;
  }

  /**
   * @description Set sequential query responses
   */
  setQuerySequence<T>(responses: T[][]): void {
    const mockResults = responses.map((data) => new MockQueryResult(data));
    this.#queryBuilder.clear();
    this.#queryBuilder.thenSequence(mockResults);
    this.#defaultQueryData = null;
  }

  /**
   * @description Set conditional query response
   */
  whenQuery(
    predicate: (query: string, params?: QueryParams) => boolean
  ): ResponseBuilder<MockQueryResult<any>> {
    this.#queryBuilder.when((args: any[]) => {
      const params = args[0] as QueryParams;
      return predicate(params.query, params);
    });
    return this.#queryBuilder;
  }

  /**
   * @description Set default insert response
   */
  setInsertResponse(result: InsertResult, options?: InsertResponseOptions): void {
    this.#defaultInsertResponse = result;
    this.#insertBuilder.clear();
    this.#insertBuilder.thenReturn(result);
  }

  /**
   * @description Set insert error
   */
  setInsertError(error: Error): void {
    this.#insertBuilder.clear();
    this.#insertBuilder.thenThrow(error);
    this.#defaultInsertResponse = null;
  }

  /**
   * @description Set conditional insert response
   */
  whenInsert(
    predicate: (params: InsertParams) => boolean
  ): ResponseBuilder<InsertResult> {
    this.#insertBuilder.when((args: any[]) => {
      const params = args[0] as InsertParams;
      return predicate(params);
    });
    return this.#insertBuilder;
  }

  /**
   * @description Set default command response
   */
  setCommandResponse(result?: { query_id?: string }): void {
    const response = { query_id: result?.query_id ?? `mock-cmd-${Date.now()}` };
    this.#defaultCommandResponse = response;
    this.#commandBuilder.clear();
    this.#commandBuilder.thenReturn(response);
  }

  /**
   * @description Set command error
   */
  setCommandError(error: Error): void {
    this.#commandBuilder.clear();
    this.#commandBuilder.thenThrow(error);
    this.#defaultCommandResponse = null;
  }

  /**
   * @description Set conditional command response
   */
  whenCommand(
    predicate: (params: CommandParams) => boolean
  ): ResponseBuilder<{ query_id: string }> {
    this.#commandBuilder.when((args: any[]) => {
      const params = args[0] as CommandParams;
      return predicate(params);
    });
    return this.#commandBuilder;
  }

  /**
   * @description Simulate query
   */
  async query<T>(params: QueryParams): Promise<MockQueryResult<T>> {
    await this.applyDelay();
    this.trackCall('query', params);

    try {
      return await this.#queryBuilder.build([params]);
    } catch (e: any) {
      // If no configuration found, use default
      if (this.#defaultQueryData !== null) {
        return new MockQueryResult<T>(this.#defaultQueryData);
      }
      throw e;
    }
  }

  /**
   * @description Simulate insert
   */
  async insert(params: InsertParams): Promise<InsertResult> {
    await this.applyDelay();
    this.trackCall('insert', params);

    try {
      return await this.#insertBuilder.build([params]);
    } catch (e: any) {
      if (this.#defaultInsertResponse !== null) {
        return this.#defaultInsertResponse;
      }
      throw e;
    }
  }

  /**
   * @description Simulate command
   */
  async command(params: CommandParams): Promise<{ query_id: string }> {
    await this.applyDelay();
    this.trackCall('command', params);

    try {
      return await this.#commandBuilder.build([params]);
    } catch (e: any) {
      if (this.#defaultCommandResponse !== null) {
        return this.#defaultCommandResponse;
      }
      throw e;
    }
  }

  /**
   * @description Simulate exec (alias for command)
   */
  async exec(params: CommandParams): Promise<{ query_id: string }> {
    return this.command(params);
  }

  /**
   * @description Simulate close
   */
  async close(): Promise<void> {
    await this.applyDelay();
    this.trackCall('close');
  }

  /**
   * @description Reset all builders and defaults
   */
  override reset(): void {
    super.reset();
    this.#queryBuilder.clear();
    this.#insertBuilder.clear();
    this.#commandBuilder.clear();
    this.#defaultQueryData = null;
    this.#defaultInsertResponse = null;
    this.#defaultCommandResponse = null;
  }
}
