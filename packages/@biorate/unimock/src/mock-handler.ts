import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue } from './interfaces';
import { isReplay } from './snapshot-store';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockProxyTargetRequiredError } from './errors';
import {
  T_REF,
  PROP_THEN,
  PROP_UNIMOCK_REF,
  PROP_PRIVATE_PREFIX,
  PREFIX_CALL,
  PREFIX_PROP,
} from './constants';
import { skipProxyArgsEnabled } from './env';
import { hasMethods, nextRefId, getReplayEntry, recordError } from './utils';

/**
 * @description Proxy wrapper for objects returned by mocked methods.
 *
 *   In **record** mode, every property access (method call) on the wrapped object is forwarded
 *   to the real target and the call is recorded into the snapshot store with key
 *   `call:{refId}:{method}:{hash}`.
 *
 *   In **replay** mode, the proxy returns a function that looks up the recorded entry in the
 *   snapshot store and returns the deserialised result (or another {@link MockHandler} for nested
 *   objects).
 *
 *   ### Features:
 *   - Methods returning objects with methods are recursively wrapped (via {@link wrapNested}),
 *     up to `store.depth` levels deep.
 *   - Asynchronous results (Promises) are handled transparently.
 *   - `then`, `constructor`, and `#`-prefixed properties are forwarded to avoid breaking
 *     thenable detection and private field access.
 */
export class MockHandler {
  /** @description Unique reference identifier used in snapshot call keys (`call:{refId}:...`). */
  public readonly __unimock_ref__: string;
  /** @description Current wrapping depth (0 = top-level). Used for {@link SnapshotStore.depth}. */
  public readonly __unimock_depth__: number;

  private store: SnapshotStore;
  private target: unknown;

  public constructor(target: unknown, refId: string, store: SnapshotStore, depth = 0) {
    this.__unimock_ref__ = refId;
    this.__unimock_depth__ = depth;
    this.target = target;
    this.store = store;

    return new Proxy(this, {
      get: (obj, prop: string | symbol) => {
        if (prop === PROP_THEN) return undefined;
        if (prop === PROP_UNIMOCK_REF) return obj.__unimock_ref__;
        if (typeof prop === 'string' && prop.startsWith(PROP_PRIVATE_PREFIX))
          return undefined;

        if (isReplay()) {
          const propKey = `${PREFIX_PROP}${obj.__unimock_ref__}:${String(prop)}:`;
          const propEntry = obj.store.get(propKey);
          if (propEntry) {
            const result = deserialize(propEntry.result);
            if (hasMethods(result))
              return new MockHandler(result, nextRefId(), obj.store, obj.__unimock_depth__ + 1);
            return result;
          }

          return (...args: unknown[]) => {
            const callKey = makeCallKey(
              `${PREFIX_CALL}${obj.__unimock_ref__}:`,
              String(prop),
              args,
            );
            const entry = getReplayEntry(obj.store, callKey, String(prop), args);
            if (entry.result.t === T_REF)
              return new MockHandler(null, entry.result.v, obj.store, obj.__unimock_depth__ + 1);
            return deserialize(entry.result);
          };
        }

        const targetObj = obj.target as Record<string | symbol, unknown> | null;
        if (!targetObj)
          throw new UnimockProxyTargetRequiredError(obj.__unimock_ref__);

        if (typeof targetObj[prop] === 'function') {
          return (...args: unknown[]) => {
            const callKey = makeCallKey(
              `${PREFIX_CALL}${obj.__unimock_ref__}:`,
              String(prop),
              args,
            );
            const originalFn = targetObj[prop] as (...a: unknown[]) => unknown;

            try {
              const rawResult = originalFn.apply(targetObj, args);
              const then =
                rawResult !== null && typeof rawResult === 'object'
                  ? (rawResult as Record<string, unknown>).then
                  : undefined;

              const recArgs = skipProxyArgsEnabled()
                ? []
                : args.map((a: unknown) => serialize(a, undefined, obj.store.symbols));

              if (typeof then === 'function') {
                return (then as (...a: unknown[]) => unknown).call(
                  rawResult,
                  (resolved: unknown) => {
                    const { wrapped, serialized } = wrapNested(resolved, obj.store, obj.__unimock_depth__);
                    obj.store.record(callKey, {
                      args: recArgs,
                      result: serialized,
                    });
                    return wrapped;
                  },
                  (error: Error) => recordError(obj.store, callKey, recArgs, error),
                );
              }

              const { wrapped, serialized } = wrapNested(rawResult, obj.store, obj.__unimock_depth__);
              obj.store.record(callKey, {
                args: recArgs,
                result: serialized,
              });
              return wrapped;
            } catch (e: unknown) {
              return recordError(
                obj.store,
                callKey,
                skipProxyArgsEnabled()
                  ? []
                  : args.map((a: unknown) => serialize(a, undefined, obj.store.symbols)),
                e,
              );
            }
          };
        }

        const propKey = `${PREFIX_PROP}${obj.__unimock_ref__}:${String(prop)}:`;
        const value = targetObj[prop];
        obj.store.record(propKey, {
          args: [],
          result: serialize(value, undefined, obj.store.symbols),
        });

        return value;
      },
    });
  }
}

const nestedRefIdCache = new WeakMap<object, string>();

/**
 * @description Wraps a result value in a {@link MockHandler} if it has methods,
 *   otherwise returns it as-is with its plain serialised form. Caches refIds via
 *   {@link nestedRefIdCache} so repeated calls returning the same object reuse the same refId.
 *   Respects {@link SnapshotStore.depth} — when `depth >= store.depth` the result
 *   is serialised directly without wrapping.
 */
function wrapNested(
  result: unknown,
  store: SnapshotStore,
  depth = 0,
): { wrapped: unknown; serialized: SerializedValue } {
  const nestedRef = (result as any)?.[PROP_UNIMOCK_REF];
  if (nestedRef) {
    return { wrapped: result, serialized: { t: T_REF, v: nestedRef } };
  }
  if (depth >= store.depth) {
    return { wrapped: result, serialized: serialize(result, undefined, store.symbols) };
  }
  if (hasMethods(result)) {
    let refId = nestedRefIdCache.get(result);
    if (!refId) {
      refId = nextRefId();
      nestedRefIdCache.set(result, refId);
    }
    return {
      wrapped: new MockHandler(result, refId, store, depth + 1),
      serialized: { t: T_REF, v: refId },
    };
  }
  return { wrapped: result, serialized: serialize(result, undefined, store.symbols) };
}
