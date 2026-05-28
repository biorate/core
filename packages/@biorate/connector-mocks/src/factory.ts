import { FileSnapshotStore } from './snapshot-store';
import { MissingSnapshotError } from './errors';
import { FactoryOptions, MOCK_ENV_VARS, ModeDetectionResult } from './interfaces';

/**
 * @description
 * Connector-like interface with get/current/connection methods
 */
export interface ConnectorLike {
  namespace?: string;
  get?(...args: any[]): any;
  current?: any;
  connection?(...args: any[]): any;
}

/**
 * @description
 * Factory function to create a mockable wrapper for any connector instance.
 *
 * Use this when you cannot or don't want to use the @Mockable() decorator.
 * Works with existing connector classes without modification.
 *
 * @example
 * ```typescript
 * import { createMockable, FileSnapshotStore } from '@biorate/connector-mocks';
 *
 * // Auto mode from env with file-based snapshots
 * const connector = createMockable(new ClickhouseConnector());
 * await connector.get().query({ query: 'SELECT 1' });
 *
 * // Explicit mode with custom snapshot store
 * const connector = createMockable(new ClickhouseConnector(), {
 *   mode: 'replay',
 *   snapshotStore: new FileSnapshotStore()
 * });
 * ```
 */
export function createMockable<T extends ConnectorLike>(
  connector: T,
  options?: FactoryOptions,
): T {
  const modeResult = detectMode(options?.mode);
  const mode = modeResult.mode;
  const namespace =
    options?.namespace ??
    connector.namespace ??
    connector.constructor?.name ??
    'Connector';
  const snapshotStore = options?.snapshotStore ?? new FileSnapshotStore();
  const proxyCache = new WeakMap<object, any>();
  const debug = options?.debug ?? false;

  // In passthrough mode, return connector as-is without proxying
  if (mode === 'passthrough') {
    return connector;
  }

  // Always create proxy - in record mode it will save snapshots, in replay mode it will load
  const handler: ProxyHandler<T> = {
    get(target, prop) {
      const value = Reflect.get(target, prop);

      // Intercept get(), current, connection() methods
      if (prop === 'get' || prop === 'connection') {
        if (typeof value === 'function') {
          return function (...args: any[]) {
            const connection = value.apply(target, args);
            const path = `${namespace}.${String(prop)}`;
            return createDeepProxy(connection, path);
          };
        }
        return createDeepProxy(value, `${namespace}.${String(prop)}`);
      }

      if (prop === 'current') {
        const connection = value;
        return createDeepProxy(connection, `${namespace}.current`);
      }

      return value;
    },
  };

  function createDeepProxy(target: any, path: string): any {
    if (!target || typeof target !== 'object') {
      return target;
    }

    if (proxyCache.has(target)) {
      return proxyCache.get(target);
    }

    const proxy = new Proxy(target, {
      get(target, prop) {
        const value = Reflect.get(target, prop);

        if (typeof value === 'function') {
          return async function (this: any, ...fnArgs: any[]) {
            const argsArray = Array.from(fnArgs);
            // Bind 'this' to the proxy target for proper method execution
            const boundValue = value.bind(target);
            return intercept(path, String(prop), boundValue, argsArray);
          };
        }

        if (value !== null && typeof value === 'object' && prop !== 'then') {
          return createDeepProxy(value, `${path}.${String(prop)}`);
        }

        return value;
      },
    });

    proxyCache.set(target, proxy);
    return proxy;
  }

  async function intercept(
    methodPath: string,
    methodName: string,
    original: (...args: any[]) => Promise<any>,
    args: any[],
  ) {
    // Full path includes the method name (e.g., 'TestConnector.get.store')
    const fullPath = `${methodPath}.${methodName}`;

    // Apply transform functions if provided
    let transformedArgs = options?.transformArgs
      ? options.transformArgs(args, methodName)
      : args;

    if (mode === 'replay') {
      // In replay mode, try to load from snapshot first
      const snapshot = await snapshotStore.load(fullPath);
      if (!snapshot) {
        throw new MissingSnapshotError(fullPath);
      }
      // Apply result transform if provided
      return options?.transformResult
        ? options.transformResult(snapshot.result, methodName)
        : snapshot.result;
    } else {
      // In record mode, execute real method and save snapshot
      const result = await original(...transformedArgs);
      const transformedResult = options?.transformResult
        ? options.transformResult(result, methodName)
        : result;

      if (debug) {
        console.log(`[connector-mocks] Recording: ${fullPath}`);
      }

      await snapshotStore.save(fullPath, {
        args: transformedArgs,
        result: transformedResult,
        timestamp: new Date().toISOString(),
      });
      // Return transformed result to the caller
      return transformedResult;
    }
  }

  return new Proxy(connector, handler);
}

/**
 * @description
 * Factory function to create a mockable connector instance.
 *
 * Similar to createMockable() but instantiates the class for you.
 *
 * @example
 * ```typescript
 * import { mockable } from '@biorate/connector-mocks';
 *
 * const connector = mockable(ClickhouseConnector);
 * await connector.get().query({ query: 'SELECT 1' });
 * ```
 */
export function mockable<T extends ConnectorLike>(
  ConnectorClass: new () => T,
  options?: FactoryOptions,
): T {
  return createMockable(new ConnectorClass(), options);
}

/**
 * @description Detect mock mode from environment variables
 *
 * Checks multiple environment variables in order:
 * CONNECTOR_MOCK_MODE → VITEST_MOCK_MODE → TEST_MOCK_MODE → MOCK_MODE
 *
 * Falls back to 'record' mode if none are set.
 *
 * @example
 * ```typescript
 * // Set in .env or command line:
 * CONNECTOR_MOCK_MODE=replay vitest run
 * ```
 */
export function detectMode(
  explicitMode?: 'record' | 'replay' | 'passthrough',
): ModeDetectionResult {
  // Explicit mode takes precedence
  if (explicitMode) {
    return { mode: explicitMode, source: 'explicit', isDefault: false };
  }

  // Check environment variables in order
  for (const envVar of MOCK_ENV_VARS) {
    const envValue = process.env[envVar];
    if (envValue) {
      const normalized = envValue.toLowerCase().trim();
      if (
        normalized === 'replay' ||
        normalized === 'record' ||
        normalized === 'passthrough'
      ) {
        return {
          mode: normalized as 'record' | 'replay' | 'passthrough',
          source: envVar,
          isDefault: false,
        };
      }
    }
  }

  // Default to record mode
  return { mode: 'record', source: 'default', isDefault: true };
}

/**
 * @description Check if currently in replay mode
 */
export function isReplayMode(): boolean {
  return detectMode().mode === 'replay';
}

/**
 * @description Check if currently in record mode
 */
export function isRecordMode(): boolean {
  return detectMode().mode === 'record';
}

/**
 * @description Check if currently in passthrough mode (no mocking)
 */
export function isPassthroughMode(): boolean {
  return detectMode().mode === 'passthrough';
}
