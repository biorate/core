import type { MockableOptions } from './interfaces';
import type { SnapshotStore } from './snapshot-store';
import { getSnapshotStore } from './snapshot-store';
import { stableHash } from './serializer';
import { collectOwnDescriptors } from './utils';
import { wrapMethod, wrapGetter } from './method-wrapper';
import { wrapStaticMethods } from './statics';
import { PROP_CONSTRUCTOR } from './constants';

/**
 * @description Class decorator that enables snapshot-based mocking.
 *
 *   In **record** mode, every method call is forwarded to the original implementation
 *   and its arguments + result are persisted into a snapshot file.
 *
 *   In **replay** mode, method calls return the previously recorded response from the snapshot
 *   without invoking the original logic.
 *
 *   ### Features:
 *   - Wraps prototype methods and getters recursively up to `Object.prototype`.
 *   - Callback arguments are intercepted and their invocations are recorded/replayed.
 *   - Results with methods are wrapped in {@link MockHandler}
 *     so subsequent calls on them are also recorded/replayed.
 *   - Supports static method wrapping via {@link MockableOptions.statics}.
 *
 * @example
 * ```ts
 * @Mockable()
 * class MockedService extends RealService {}
 * ```
 *
 * @param options - optional configuration (snapshot directory, static wrapping)
 */
export function Mockable(options?: MockableOptions) {
  return function <T extends new (...args: any[]) => object>(Base: T): T {
    const className = Base.name;
    const store = getSnapshotStore(className, options?.snapshotDir, options?.importMeta);
    store.symbols = options?.symbols ?? false;
    store.depth = options?.depth ?? Infinity;

    patchPrototype(Base.prototype, store);

    if (options?.statics) {
      wrapStaticMethods(Base, store, options.statics);
    }

    return Base;
  };
}

function patchPrototype(proto: object, store: SnapshotStore): void {
  const entries = collectOwnDescriptors(proto, Object.prototype, {
    skipKeys: new Set([PROP_CONSTRUCTOR]),
    skipPrefix: '#',
  });

  for (const { key, descriptor } of entries) {
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(proto, key, {
        value: wrapMethod(
          key,
          descriptor.value as (...args: unknown[]) => unknown,
          store,
        ),
        writable: descriptor.writable,
        configurable: descriptor.configurable,
      });
    }
    if (descriptor.get) {
      Object.defineProperty(proto, key, {
        get: wrapGetter(key, descriptor.get, store),
        set: descriptor.set,
        configurable: true,
      });
    }
  }
}

/**
 * @description Functional alternative to the `@Mockable()` decorator.
 *   Returns the same class with prototype methods wrapped, without using decorator syntax.
 *
 * @example
 * ```ts
 * import { mock, SnapshotStore } from '@biorate/unimock';
 *
 * const MockedService = mock(RealService);
 * const instance = new MockedService();
 * ```
 */
export function mock<T extends new (...args: any[]) => object>(
  Base: T,
  options?: MockableOptions,
): T;
/**
 * @description Creates a snapshot-mocked copy of a plain object.
 *   The returned object has all methods wrapped for record/replay.
 *   The original object is not mutated.
 *
 * @example
 * ```ts
 * import { mock, SnapshotStore } from '@biorate/unimock';
 *
 * const obj = mock({ query: async (sql: string) => ({ data: [1] }) }, {
 *   importMeta: import.meta,
 * });
 * await obj.query('SELECT 1'); // recorded or replayed
 * ```
 */
export function mock<T extends Record<string, any>>(
  Base: T,
  options?: MockableOptions,
): T;
export function mock(Base: any, options?: MockableOptions): any {
  if (typeof Base === 'function' && Base.prototype) {
    return Mockable(options)(Base);
  }
  return mockObject(Base, options);
}

/**
 * @description Creates a snapshot-mocked copy of a plain object.
 *   Each method on the object is wrapped for record/replay.
 *   The original object is not mutated — a shallow copy is returned.
 */
function mockObject<T extends Record<string, any>>(obj: T, options?: MockableOptions): T {
  const className = resolveObjectName(obj, options?.name);
  const store = getSnapshotStore(className, options?.snapshotDir, options?.importMeta);
  store.symbols = options?.symbols ?? false;
  store.depth = options?.depth ?? Infinity;

  const result = Object.assign(Object.create(Object.getPrototypeOf(obj)) as T, obj);

  const entries = collectOwnDescriptors(result, Object.prototype, {
    skipKeys: new Set([PROP_CONSTRUCTOR]),
    skipPrefix: '#',
  });

  for (const { key, descriptor } of entries) {
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(result, key, {
        value: wrapMethod(
          key,
          descriptor.value as (...args: unknown[]) => unknown,
          store,
        ),
        writable: descriptor.writable,
        configurable: descriptor.configurable,
      });
    }
    if (descriptor.get) {
      Object.defineProperty(result, key, {
        get: wrapGetter(key, descriptor.get, store),
        set: descriptor.set,
        configurable: true,
      });
    }
  }

  return result;
}

/**
 * @description Resolves a snapshot class name for a plain object.
 *   Priority: `explicitName` → `obj.constructor.name` (if not `Object`) →
 *   `Object_<stableHash>`.
 */
function resolveObjectName(obj: Record<string, any>, explicitName?: string): string {
  if (explicitName) return explicitName;
  const ctorName = obj.constructor?.name;
  if (ctorName && ctorName !== 'Object') return ctorName;
  const keys = Object.keys(obj).sort();
  return `Object_${stableHash(keys)}`;
}