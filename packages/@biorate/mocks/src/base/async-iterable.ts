/**
 * @description Create async iterable from array
 *
 * @param data - Data to iterate
 * @param options - Iteration options
 *
 * @example
 * ```ts
 * const iterable = createAsyncIterable([1, 2, 3], { delayBetweenItems: 10 });
 *
 * for await (const item of iterable) {
 *   console.log(item);
 * }
 * ```
 */
export function createAsyncIterable<T>(
  data: T[],
  options?: {
    delayBetweenItems?: number;
    onError?: (index: number) => void;
  }
): AsyncIterableIterator<T> {
  const { delayBetweenItems = 0, onError } = options ?? {};

  let index = 0;

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (index >= data.length) {
        return { done: true, value: undefined };
      }

      if (delayBetweenItems > 0 && index > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenItems));
      }

      try {
        const value = data[index++];
        return { done: false, value };
      } catch (e) {
        onError?.(index);
        throw e;
      }
    },
  };
}

/**
 * @description Mock QueryResult for ClickHouse with async iteration support
 *
 * @example
 * ```ts
 * const result = new MockQueryResult([{ id: 1 }, { id: 2 }]);
 *
 * // Async iteration
 * for await (const row of result) {
 *   console.log(row);
 * }
 *
 * // Or get all at once
 * const { data } = await result.json();
 * ```
 */
export class MockQueryResult<T> implements AsyncIterable<T> {
  /**
   * @description Query data
   */
  readonly #data: T[];
  /**
   * @description Query ID
   */
  readonly #query_id: string;

  constructor(data: T[], options?: { query_id?: string }) {
    this.#data = data;
    this.#query_id = options?.query_id ?? `mock-query-${Date.now()}`;
  }

  /**
   * @description Async iterator
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const item of this.#data) {
      yield item;
      await Promise.resolve();
    }
  }

  /**
   * @description Get data as JSON
   */
  async json(): Promise<{ data: T[]; query_id: string }> {
    return { data: this.#data, query_id: this.#query_id };
  }

  /**
   * @description Get data as text
   */
  async text(): Promise<string> {
    return JSON.stringify(this.#data);
  }

  /**
   * @description Get query ID
   */
  get query_id(): string {
    return this.#query_id;
  }

  /**
   * @description Get data
   */
  get data(): T[] {
    return this.#data;
  }
}
