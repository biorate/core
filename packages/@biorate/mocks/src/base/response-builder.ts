type ResponseCondition<T> = (args: any[]) => boolean;

interface ResponseConfig<T> {
  condition?: ResponseCondition<T>;
  value?: T | (() => T | Promise<T>);
  error?: Error;
  delay?: number;
  sequence?: T[];
  sequenceIndex?: number;
  realImplementation?: (...args: any[]) => T | Promise<T>;
}

/**
 * @description Fluent API builder for configuring mock responses
 *
 * ### Features:
 * - Conditional responses
 * - Sequential responses
 * - Error simulation
 * - Delay simulation
 * - Real implementation fallback
 *
 * @example
 * ```ts
 * const builder = new ResponseBuilder<QueryResult>();
 *
 * builder
 *   .when(([query]) => query.includes('users'))
 *   .thenReturn({ data: [{ id: 1 }] })
 *   .when(([query]) => query.includes('orders'))
 *   .thenThrow(new Error('Database error'))
 *   .thenResolveAfter(100, { data: [] });
 *
 * const result = await builder.build(['SELECT * FROM users']);
 * ```
 */
export class ResponseBuilder<T> {
  /**
   * @description Response configurations
   */
  readonly #responses: ResponseConfig<T>[] = [];
  /**
   * @description Current condition for chaining
   */
  #currentCondition: ResponseCondition<T> | undefined = undefined;

  /**
   * @description Set condition for next response
   */
  when(condition: ResponseCondition<T>): this {
    this.#currentCondition = condition;
    return this;
  }

  /**
   * @description Clear current condition
   */
  #clearCondition(): void {
    this.#currentCondition = undefined;
  }

  /**
   * @description Return value for matching condition
   */
  thenReturn(value: T | (() => T | Promise<T>)): this {
    this.#responses.push({
      condition: this.#currentCondition,
      value,
    });
    this.#clearCondition();
    return this;
  }

  /**
   * @description Throw error for matching condition
   */
  thenThrow(error: Error): this {
    this.#responses.push({
      condition: this.#currentCondition,
      error,
    });
    this.#clearCondition();
    return this;
  }

  /**
   * @description Return value after delay
   */
  thenResolveAfter(ms: number, value: T | (() => T | Promise<T>)): this {
    this.#responses.push({
      condition: this.#currentCondition,
      value,
      delay: ms,
    });
    this.#clearCondition();
    return this;
  }

  /**
   * @description Return sequence of values
   */
  thenSequence(values: T[]): this {
    this.#responses.push({
      condition: this.#currentCondition,
      sequence: values,
      sequenceIndex: 0,
    });
    this.#clearCondition();
    return this;
  }

  /**
   * @description Call real implementation if no match
   */
  thenCallRealImplementation(fn: (...args: any[]) => T | Promise<T>): this {
    this.#responses.push({
      condition: this.#currentCondition,
      realImplementation: fn,
    });
    this.#clearCondition();
    return this;
  }

  /**
   * @description Build response based on arguments
   */
  async build(args: any[]): Promise<T> {
    const matchingResponse = this.#responses.find((config) => {
      if (!config.condition) return true;
      return config.condition(args);
    });

    if (!matchingResponse) {
      throw new Error('No matching response configuration found');
    }

    if (matchingResponse.error) {
      throw matchingResponse.error;
    }

    if (matchingResponse.delay) {
      await new Promise((resolve) => setTimeout(resolve, matchingResponse.delay));
    }

    if (matchingResponse.sequence) {
      const index = matchingResponse.sequenceIndex ?? 0;
      const value = matchingResponse.sequence[index];
      matchingResponse.sequenceIndex = (index + 1) % matchingResponse.sequence.length;
      return this.#resolveValue(value, args);
    }

    if (matchingResponse.realImplementation) {
      return matchingResponse.realImplementation(...args);
    }

    if (matchingResponse.value) {
      return this.#resolveValue(matchingResponse.value, args);
    }

    throw new Error('Response configuration is incomplete');
  }

  /**
   * @description Resolve value (handle functions)
   */
  async #resolveValue(value: T | (() => T | Promise<T>), args: any[]): Promise<T> {
    if (typeof value === 'function') {
      return (value as (...args: any[]) => T | Promise<T>)(...args);
    }
    return value;
  }

  /**
   * @description Clear all configurations
   */
  clear(): void {
    this.#responses.length = 0;
    this.#currentCondition = undefined;
  }
}
