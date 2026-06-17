import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue } from './interfaces';
import { isReplay } from './snapshot-store';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockConnectionHandlerTargetRequiredError } from './errors';
import {
  T_REF,
  PROP_THEN,
  PROP_UNIMOCK_REF,
  PROP_PRIVATE_PREFIX,
  PREFIX_CONN,
  PREFIX_CONN_PROP,
} from './constants';
import { skipConnArgsEnabled } from './env';
import { hasMethods, nextRefId, getReplayEntry, recordError } from './utils';

/**
 * @description Proxy wrapper for connection objects returned by mocked connectors.
 *
 *   In **record** mode, every property access (method call) on the wrapped object is forwarded
 *   to the real target and the call is recorded into the snapshot store with key
 *   `conn:{refId}:{method}:{hash}`.
 *
 *   In **replay** mode, the proxy returns a function that looks up the recorded entry in the
 *   snapshot store and returns the deserialised result (or another ConnectionHandler for nested
 *   objects).
 *
 *   ### Features:
 *   - Methods returning objects with methods are recursively wrapped (via {@link wrapNested}).
 *   - Asynchronous results (Promises) are handled transparently.
 *   - `then`, `constructor`, and `#`-prefixed properties are forwarded to avoid breaking
 *     thenable detection and private field access.
 *
 * @example
 * ```ts
 * const conn = new ConnectionHandler(realClickhouseClient, 'obj_0', store);
 * const result = await conn.query({ query: 'SELECT 1' });
 * ```
 */
export class ConnectionHandler {
  /** @description Unique reference identifier used in snapshot call keys (`conn:{refId}:...`). */
  public readonly __unimock_ref__: string;

  private store: SnapshotStore;
  private target: unknown;

  public constructor(target: unknown, refId: string, store: SnapshotStore) {
    this.__unimock_ref__ = refId;
    this.target = target;
    this.store = store;

    return new Proxy(this, {
      get: (obj, prop: string | symbol) => {
        if (prop === PROP_THEN) return undefined;
        if (prop === PROP_UNIMOCK_REF) return obj.__unimock_ref__;
        if (typeof prop === 'string' && prop.startsWith(PROP_PRIVATE_PREFIX))
          return undefined;

        if (isReplay()) {
          const propKey = `${PREFIX_CONN_PROP}${obj.__unimock_ref__}:${String(prop)}:`;
          const propEntry = obj.store.get(propKey);
          if (propEntry) {
            const result = deserialize(propEntry.result);
            if (hasMethods(result))
              return new ConnectionHandler(result, nextRefId(), obj.store);
            return result;
          }

          return (...args: unknown[]) => {
            const callKey = makeCallKey(
              `${PREFIX_CONN}${obj.__unimock_ref__}:`,
              String(prop),
              args,
            );
            const entry = getReplayEntry(obj.store, callKey, String(prop), args);
            if (entry.result.t === T_REF)
              return new ConnectionHandler(null, entry.result.v, obj.store);
            return deserialize(entry.result);
          };
        }

        const targetObj = obj.target as Record<string | symbol, unknown> | null;
        if (!targetObj)
          throw new UnimockConnectionHandlerTargetRequiredError(obj.__unimock_ref__);

        if (typeof targetObj[prop] === 'function') {
          return (...args: unknown[]) => {
            const callKey = makeCallKey(
              `${PREFIX_CONN}${obj.__unimock_ref__}:`,
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

              const recArgs = skipConnArgsEnabled()
                ? []
                : args.map((a: unknown) => serialize(a, undefined, obj.store.symbols));

              if (typeof then === 'function') {
                return (then as (...a: unknown[]) => unknown).call(
                  rawResult,
                  (resolved: unknown) => {
                    const { wrapped, serialized } = wrapNested(resolved, obj.store);
                    obj.store.record(callKey, {
                      args: recArgs,
                      result: serialized,
                    });
                    return wrapped;
                  },
                  (error: Error) => recordError(obj.store, callKey, recArgs, error),
                );
              }

              const { wrapped, serialized } = wrapNested(rawResult, obj.store);
              obj.store.record(callKey, {
                args: recArgs,
                result: serialized,
              });
              return wrapped;
            } catch (e: unknown) {
              return recordError(
                obj.store,
                callKey,
                skipConnArgsEnabled()
                  ? []
                  : args.map((a: unknown) => serialize(a, undefined, obj.store.symbols)),
                e,
              );
            }
          };
        }

        const propKey = `${PREFIX_CONN_PROP}${obj.__unimock_ref__}:${String(prop)}:`;
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
 * @description Wraps a result value in a {@link ConnectionHandler} if it has methods,
 *   otherwise returns it as-is with its plain serialised form. Caches refIds via
 *   {@link nestedRefIdCache} so repeated calls returning the same object reuse the same refId.
 */
function wrapNested(
  result: unknown,
  store: SnapshotStore,
): { wrapped: unknown; serialized: SerializedValue } {
  const nestedRef = (result as any)?.[PROP_UNIMOCK_REF];
  if (nestedRef) {
    return { wrapped: result, serialized: { t: T_REF, v: nestedRef } };
  }
  if (hasMethods(result)) {
    let refId = nestedRefIdCache.get(result);
    if (!refId) {
      refId = nextRefId();
      nestedRefIdCache.set(result, refId);
    }
    return {
      wrapped: new ConnectionHandler(result, refId, store),
      serialized: { t: T_REF, v: refId },
    };
  }
  return { wrapped: result, serialized: serialize(result, undefined, store.symbols) };
}
