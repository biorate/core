import { Mock, vi } from 'vitest';
type SpyInstance = ReturnType<typeof vi.fn>;
import { BaseCall } from './types';

/**
 * @description Base class for mock connections with Vitest spies integration
 *
 * ### Features:
 * - Call tracking via Vitest spies
 * - Method call assertions
 * - Delay simulation
 * - Call history
 *
 * @example
 * ```ts
 * class MockConnection extends MockConnection<ClickHouseCall> {
 *   async query(params: QueryParams) {
 *     this.#trackCall('query', [params]);
 *     return new MockQueryResult(data);
 *   }
 *
 *   #trackCall(method: string, args: any[]) {
 *     super.trackCall(method, args);
 *   }
 * }
 *
 * const connection = new MockConnection();
 * await connection.query({ query: 'SELECT 1' });
 *
 * expect(connection.wasCalled('query')).toBe(true);
 * expect(connection.getCallCount('query')).toBe(1);
 * ```
 */
export abstract class MockConnection<TCall extends BaseCall = BaseCall> {
  /**
   * @description Spy methods map for tracking calls
   */
  readonly #methods: Map<string, SpyInstance> = new Map();
  /**
   * @description Delay in milliseconds for simulating network latency
   */
  #delay = 0;

  /**
   * @description Track a method call
   */
  protected trackCall(method: string, ...args: any[]): void {
    const spy = this.#getOrCreateSpy(method);
    spy(method, ...args);
  }

  /**
   * @description Get or create spy for method
   */
  #getOrCreateSpy(name: string): SpyInstance {
    if (!this.#methods.has(name)) {
      this.#methods.set(name, vi.fn());
    }
    return this.#methods.get(name)!;
  }

  /**
   * @description Get all mock methods
   */
  getMethods(): Record<string, Mock> {
    return Object.fromEntries(
      [...this.#methods.entries()].map(([name, spy]) => [name, spy])
    );
  }

  /**
   * @description Check if method was called
   * @param method - Method name
   * @param args - Optional arguments to match
   */
  wasCalled(method: string, args?: any[]): boolean {
    const spy = this.#methods.get(method);
    if (!spy) return false;

    if (!args) return spy.mock.calls.length > 0;

    return spy.mock.calls.some((call: any[]) => {
      const callArgs = call.slice(1);
      return args.every((arg, i) => this.#deepEqual(callArgs[i], arg));
    });
  }

  /**
   * @description Get call count for method
   */
  getCallCount(method: string): number {
    return this.#methods.get(method)?.mock.calls.length ?? 0;
  }

  /**
   * @description Get last call for method
   */
  getLastCall<T = any>(method: string): TCall | null {
    const spy = this.#methods.get(method);
    if (!spy || spy.mock.calls.length === 0) return null;

    const [methodName, ...args] = spy.mock.calls[spy.mock.calls.length - 1];
    return {
      method: methodName as string,
      args,
      timestamp: Date.now(),
    } as TCall;
  }

  /**
   * @description Get all calls for method
   */
  getAllCalls(method: string): TCall[] {
    const spy = this.#methods.get(method);
    if (!spy) return [];

    return spy.mock.calls.map((call: any[]) => ({
      method: call[0] as string,
      args: call.slice(1),
      timestamp: Date.now(),
    })) as TCall[];
  }

  /**
   * @description Clear call history
   */
  clearCalls(): void {
    this.#methods.forEach((spy) => spy.mockClear());
  }

  /**
   * @description Reset all mocks and settings
   */
  reset(): void {
    this.#methods.clear();
    this.#delay = 0;
  }

  /**
   * @description Set delay for all methods
   */
  withDelay(ms: number): this {
    this.#delay = ms;
    return this;
  }

  /**
   * @description Get Vitest mock for method (for assertions)
   */
  expectMethod(method: string): Mock {
    const spy = this.#methods.get(method);
    if (!spy) {
      throw new Error(`Method "${method}" was not tracked`);
    }
    return spy;
  }

  /**
   * @description Deep equality check for arguments
   */
  #deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object') {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      if (Array.isArray(a)) {
        return a.length === b.length && a.every((v, i) => this.#deepEqual(v, b[i]));
      }
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => this.#deepEqual(a[key], b[key]));
    }

    return false;
  }

  /**
   * @description Apply delay if configured
   */
  protected async applyDelay(): Promise<void> {
    if (this.#delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.#delay));
    }
  }
}
