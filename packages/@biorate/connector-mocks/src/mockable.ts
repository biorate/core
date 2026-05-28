import { VitestSnapshotStore, SnapshotStore } from './snapshot-store';
import { MissingSnapshotError } from './errors';

/**
 * @description
 * Decorator for automatic connector mocking with snapshot-based testing.
 *
 * @deprecated Use `createMockable()` or `mockClickhouse()` factories instead.
 * The decorator has limitations with TypeScript private fields and may not work
 * correctly with all connector implementations.
 *
 * When applied to a connector class, automatically intercepts all method calls
 * on connection objects (returned by get(), current, connection()) and:
 * - In 'record' mode: executes real methods and saves snapshots
 * - In 'replay' mode: returns data from snapshots without real DB calls
 *
 * Mode is auto-detected from CONNECTOR_MOCK_MODE environment variable:
 * - 'replay' → mock mode (no DB needed)
 * - anything else → record mode (real DB)
 *
 * @example
 * ```typescript
 * import { Mockable } from '@biorate/connector-mocks';
 *
 * @Mockable()
 * class ClickhouseConnector extends Connector<...> { ... }
 * ```
 *
 * @recommended
 * ```typescript
 * import { mockClickhouse } from '@biorate/connector-mocks';
 *
 * // Recommended approach using factory
 * const connector = mockClickhouse(ClickhouseConnector);
 * ```
 */
export function Mockable() {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    return class MockableConnector extends target {
      #mode: 'record' | 'replay';
      #snapshotStore: SnapshotStore;
      #proxyCache = new WeakMap<object, any>();
      #namespace: string;

      constructor(...args: any[]) {
        super(...args);
        this.#mode = this.#detectMode();
        this.#snapshotStore = new VitestSnapshotStore();
        this.#namespace = (this as any).namespace ?? target.name;
      }

      #detectMode(): 'record' | 'replay' {
        const envMode = process.env.CONNECTOR_MOCK_MODE;
        return envMode === 'replay' ? 'replay' : 'record';
      }

      get(): any {
        // Call parent method via prototype chain
        const parentDescriptor = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const parentGet =
          parentDescriptor.get || Object.getPrototypeOf(parentDescriptor).get;
        const connection = parentGet
          ? parentGet.call(this)
          : (this as any).connections.values().next().value;
        return this.#mode === 'replay'
          ? this.#createProxy(connection, `${this.#namespace}.get`)
          : connection;
      }

      get current(): any {
        const parentDescriptor = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const parentCurrent = Object.getOwnPropertyDescriptor(
          parentDescriptor,
          'current',
        );
        const connection = parentCurrent?.get
          ? parentCurrent.get.call(this)
          : (this as any).current;
        return this.#mode === 'replay'
          ? this.#createProxy(connection, `${this.#namespace}.current`)
          : connection;
      }

      connection(name?: string): any {
        const parentDescriptor = Object.getPrototypeOf(Object.getPrototypeOf(this));
        const parentConnection = parentDescriptor.connection;
        const conn = parentConnection
          ? parentConnection.call(this, name)
          : (this as any).connections.get(name);
        return this.#mode === 'replay'
          ? this.#createProxy(conn, `${this.#namespace}.connection(${name ?? 'default'})`)
          : conn;
      }

      #createProxy(target: any, path: string): any {
        if (this.#proxyCache.has(target)) {
          return this.#proxyCache.get(target);
        }

        const self = this;
        const proxy = new Proxy(target, {
          get(target, prop) {
            const value = Reflect.get(target, prop);

            // Intercept function calls
            if (typeof value === 'function') {
              return async function (...args: any[]) {
                return self.#intercept(`${path}.${String(prop)}`, value, args);
              };
            }

            // Recursively proxy nested objects (models, cursors)
            if (value !== null && typeof value === 'object' && prop !== 'then') {
              return self.#createProxy(value, `${path}.${String(prop)}`);
            }

            return value;
          },
        });

        this.#proxyCache.set(target, proxy);
        return proxy;
      }

      async #intercept(
        methodPath: string,
        original: (...args: any[]) => Promise<any>,
        args: any[],
      ) {
        if (this.#mode === 'record') {
          const result = await original(...args);
          await this.#snapshotStore.save(methodPath, { args, result });
          return result;
        } else {
          const snapshot = await this.#snapshotStore.load(methodPath);
          if (!snapshot) {
            throw new MissingSnapshotError(methodPath);
          }
          return snapshot.result;
        }
      }
    };
  };
}
