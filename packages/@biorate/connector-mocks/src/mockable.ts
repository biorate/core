import { FileSnapshotStore, SnapshotStore } from './snapshot-store';
import { MockableOptions } from './interfaces';

/**
 * @description
 * Decorator for automatic connector mocking with snapshot-based testing.
 *
 * When applied to a connector class, automatically intercepts all method calls
 * on connection objects (returned by get(), current, connection()) and:
 * - If snapshot exists: returns data from snapshot
 * - If snapshot doesn't exist: executes real method and saves snapshot
 *
 * @example
 * ```typescript
 * import { Mockable } from '@biorate/connector-mocks';
 *
 * @Mockable()
 * class ClickhouseConnector extends Connector<...> { ... }
 * ```
 *
 * @example
 * ```typescript
 * // With custom options
 * @Mockable({
 *   namespace: 'MyConnector',
 *   debug: true
 * })
 * class MyConnector { ... }
 * ```
 */
export function Mockable(options: MockableOptions = {}) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    return class MockableConnector extends target {
      readonly snapshotStore: SnapshotStore;
      #proxyCache = new WeakMap<object, any>();
      #namespace: string;
      #debug: boolean;
      #transformArgs?: (args: any[], methodName: string) => any[];
      #transformResult?: (result: any, methodName: string) => any;

      constructor(...args: any[]) {
        super(...args);
        this.snapshotStore = options.snapshotStore ?? new FileSnapshotStore();
        this.#namespace = options.namespace ?? (this as any).namespace ?? target.name;
        this.#debug = options.debug ?? false;
        this.#transformArgs = options.transformArgs;
        this.#transformResult = options.transformResult;
      }

      #createProxy(target: any, path: string): any {
        if (this.#proxyCache.has(target)) {
          return this.#proxyCache.get(target);
        }

        const self = this;
        const proxy = new Proxy(target, {
          get(target, prop) {
            const value = Reflect.get(target, prop);

            if (typeof value === 'function') {
              return async function (...args: any[]) {
                return self.#intercept(`${path}.${String(prop)}`, value, args);
              };
            }

            if (value !== null && typeof value === 'object' && prop !== 'then') {
              return self.#createProxy(value, `${path}.${String(prop)}`);
            }

            return value;
          },
        });

        this.#proxyCache.set(target, proxy);
        return proxy;
      }

      #wrapConnection(connection: any, basePath: string): any {
        return this.#createProxy(connection, basePath);
      }

      get(): any {
        const decoratedProto = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const parentGet = decoratedProto.get;
        const connection = parentGet
          ? parentGet.call(this)
          : (this as any).connections?.values().next().value;
        return this.#wrapConnection(connection, `${this.#namespace}.get`);
      }

      get current(): any {
        const thisProto = Object.getPrototypeOf(this);
        const mockableProto = Object.getPrototypeOf(thisProto);
        const targetProto = Object.getPrototypeOf(mockableProto);

        const currentDesc = Object.getOwnPropertyDescriptor(targetProto, 'current');
        const connection = currentDesc?.get
          ? currentDesc.get.call(this)
          : (this as any).current;
        return this.#wrapConnection(connection, `${this.#namespace}.current`);
      }

      connection(name?: string): any {
        const decoratedProto = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const parentConnection = decoratedProto.connection;
        const conn = parentConnection
          ? parentConnection.call(this, name)
          : (this as any).connections?.get(name);
        return this.#wrapConnection(
          conn,
          `${this.#namespace}.connection(${name ?? 'default'})`,
        );
      }

      async #intercept(
        methodPath: string,
        original: (...args: any[]) => Promise<any>,
        args: any[],
      ) {
        const fullPath = methodPath;
        const methodName = methodPath.split('.').pop() || '';

        let transformedArgs = this.#transformArgs
          ? this.#transformArgs(args, methodName)
          : args;

        const snapshot = await this.snapshotStore.load(fullPath);
        if (snapshot) {
          return this.#transformResult
            ? this.#transformResult(snapshot.result, methodName)
            : snapshot.result;
        }

        const result = await original(...transformedArgs);
        const transformedResult = this.#transformResult
          ? this.#transformResult(result, methodName)
          : result;

        if (this.#debug) {
          console.log(`[connector-mocks] Recording: ${fullPath}`);
        }

        await this.snapshotStore.save(fullPath, {
          args: transformedArgs,
          result: transformedResult,
          timestamp: new Date().toISOString(),
        });
        return transformedResult;
      }
    };
  };
}
