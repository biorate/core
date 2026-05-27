import { Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { ResponseBuilder } from '../base/response-builder';

/**
 * @description Mock Model for Sequelize with configurable responses
 *
 * ### Features:
 * - findAll, findOne, create, update, destroy simulation
 * - Conditional responses
 * - Error simulation
 * - Call tracking
 *
 * @example
 * ```ts
 * const mockModel = new MockModel<TestModel>();
 *
 * mockModel.setFindAllResponse([{ id: 1, name: 'test' }]);
 * mockModel.setCreateResponse({ id: 2, name: 'new' });
 *
 * const items = await mockModel.findAll();
 * const created = await mockModel.create({ name: 'new' });
 * ```
 */
export class MockModel<T extends Model = Model> {
  /**
   * @description FindAll response builder
   */
  readonly #findAllBuilder: ResponseBuilder<T[]> = new ResponseBuilder();
  /**
   * @description FindOne response builder
   */
  readonly #findOneBuilder: ResponseBuilder<T | null> = new ResponseBuilder();
  /**
   * @description Create response builder
   */
  readonly #createBuilder: ResponseBuilder<T> = new ResponseBuilder();
  /**
   * @description Update response builder
   */
  readonly #updateBuilder: ResponseBuilder<[number, T[]]> = new ResponseBuilder();
  /**
   * @description Destroy response builder
   */
  readonly #destroyBuilder: ResponseBuilder<number> = new ResponseBuilder();
  /**
   * @description Default find all data
   */
  #defaultFindAllData: T[] = [];
  /**
   * @description Default find one data
   */
  #defaultFindOneData: T | null = null;
  /**
   * @description Default create data
   */
  #defaultCreateData: T | null = null;
  /**
   * @description Call history
   */
  readonly #calls: Array<{ method: string; args: any[]; timestamp: number }> = [];

  /**
   * @description Set default findAll response
   */
  setFindAllResponse(data: T[]): void {
    this.#defaultFindAllData = data;
    this.#findAllBuilder.clear();
    this.#findAllBuilder.thenReturn(data);
  }

  /**
   * @description Set findOne response
   */
  setFindOneResponse(data: T | null): void {
    this.#defaultFindOneData = data;
    this.#findOneBuilder.clear();
    this.#findOneBuilder.thenReturn(data);
  }

  /**
   * @description Set create response
   */
  setCreateResponse(data: T): void {
    this.#defaultCreateData = data;
    this.#createBuilder.clear();
    this.#createBuilder.thenReturn(data);
  }

  /**
   * @description Set update response
   */
  setUpdateResponse(count: number, instances?: T[]): void {
    this.#updateBuilder.clear();
    this.#updateBuilder.thenReturn([count, instances ?? []]);
  }

  /**
   * @description Set destroy response
   */
  setDestroyResponse(count: number): void {
    this.#destroyBuilder.clear();
    this.#destroyBuilder.thenReturn(count);
  }

  /**
   * @description Set findAll error
   */
  setFindAllError(error: Error): void {
    this.#findAllBuilder.clear();
    this.#findAllBuilder.thenThrow(error);
  }

  /**
   * @description Set findOne error
   */
  setFindOneError(error: Error): void {
    this.#findOneBuilder.clear();
    this.#findOneBuilder.thenThrow(error);
  }

  /**
   * @description Set create error
   */
  setCreateError(error: Error): void {
    this.#createBuilder.clear();
    this.#createBuilder.thenThrow(error);
  }

  /**
   * @description Conditional findAll response
   */
  whenFindAll(
    predicate: (options?: FindOptions) => boolean
  ): ResponseBuilder<T[]> {
    this.#findAllBuilder.when(([options]) => predicate(options));
    return this.#findAllBuilder;
  }

  /**
   * @description Conditional findOne response
   */
  whenFindOne(
    predicate: (options?: FindOptions) => boolean
  ): ResponseBuilder<T | null> {
    this.#findOneBuilder.when(([options]) => predicate(options));
    return this.#findOneBuilder;
  }

  /**
   * @description Conditional create response
   */
  whenCreate(
    predicate: (values: any, options?: CreateOptions) => boolean
  ): ResponseBuilder<T> {
    this.#createBuilder.when(([values, options]) => predicate(values, options));
    return this.#createBuilder;
  }

  /**
   * @description Simulate findAll
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    this.#trackCall('findAll', [options]);

    try {
      return await this.#findAllBuilder.build([options]);
    } catch (e: any) {
      if (this.#defaultFindAllData.length > 0) {
        return this.#defaultFindAllData;
      }
      throw e;
    }
  }

  /**
   * @description Simulate findOne
   */
  async findOne(options?: FindOptions): Promise<T | null> {
    this.#trackCall('findOne', [options]);

    try {
      return await this.#findOneBuilder.build([options]);
    } catch (e: any) {
      if (this.#defaultFindOneData !== null) {
        return this.#defaultFindOneData;
      }
      throw e;
    }
  }

  /**
   * @description Simulate findByPk
   */
  async findByPk(options: any): Promise<T | null> {
    this.#trackCall('findByPk', [options]);
    return this.findOne({ where: { id: options } });
  }

  /**
   * @description Simulate create
   */
  async create(values: any, options?: CreateOptions): Promise<T> {
    this.#trackCall('create', [values, options]);

    try {
      return await this.#createBuilder.build([values, options]);
    } catch (e: any) {
      if (this.#defaultCreateData !== null) {
        return this.#defaultCreateData;
      }
      throw e;
    }
  }

  /**
   * @description Simulate update
   */
  async update(values: any, options?: UpdateOptions): Promise<[number, T[]]> {
    this.#trackCall('update', [values, options]);

    try {
      return await this.#updateBuilder.build([values, options]);
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * @description Simulate destroy
   */
  async destroy(options?: DestroyOptions): Promise<number> {
    this.#trackCall('destroy', [options]);

    try {
      return await this.#destroyBuilder.build([options]);
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * @description Simulate sync
   */
  async sync(options?: any): Promise<any> {
    this.#trackCall('sync', [options]);
    return {};
  }

  /**
   * @description Simulate drop
   */
  async drop(options?: any): Promise<void> {
    this.#trackCall('drop', [options]);
  }

  /**
   * @description Track method call
   */
  #trackCall(method: string, args: any[]): void {
    this.#calls.push({
      method,
      args,
      timestamp: Date.now(),
    });
  }

  /**
   * @description Get call history
   */
  getCalls(): Array<{ method: string; args: any[]; timestamp: number }> {
    return [...this.#calls];
  }

  /**
   * @description Get call count for method
   */
  getCallCount(method: string): number {
    return this.#calls.filter((call) => call.method === method).length;
  }

  /**
   * @description Check if method was called
   */
  wasCalled(method: string): boolean {
    return this.#calls.some((call) => call.method === method);
  }

  /**
   * @description Clear call history
   */
  clearCalls(): void {
    this.#calls.length = 0;
  }

  /**
   * @description Reset all configurations
   */
  reset(): void {
    this.#findAllBuilder.clear();
    this.#findOneBuilder.clear();
    this.#createBuilder.clear();
    this.#updateBuilder.clear();
    this.#destroyBuilder.clear();
    this.#defaultFindAllData = [];
    this.#defaultFindOneData = null;
    this.#defaultCreateData = null;
    this.clearCalls();
  }
}
