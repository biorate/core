import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue } from './interfaces';
import { makeCallKey, serialize, deserialize } from './serializer';
import {
  UnimockReplayMissError,
  UnimockConnectionHandlerTargetRequiredError,
} from './errors';

export class ConnectionHandler {
  public readonly __unimock_ref__: string;

  private store: SnapshotStore;
  private target: unknown;

  public constructor(target: unknown, refId: string, store: SnapshotStore) {
    this.__unimock_ref__ = refId;
    this.target = target;
    this.store = store;

    return new Proxy(this, {
      get: (obj, prop: string | symbol) => {
        if (prop === 'then') return undefined;
        if (prop === '__unimock_ref__') return obj.__unimock_ref__;
        if (typeof prop === 'string' && prop.startsWith('#')) return undefined;

        const mode = obj.store.mode;

        if (mode === 'replay') {
          return (...args: unknown[]) => {
            const callKey = makeCallKey(
              `conn:${obj.__unimock_ref__}:`,
              String(prop),
              args,
            );
            const entry = obj.store.get(callKey);
            if (!entry) throw new UnimockReplayMissError(callKey, String(prop), args);
            if (entry.error) throw deserialize(entry.error) as Error;
            if (entry.result.t === 'ref')
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
              `conn:${obj.__unimock_ref__}:`,
              String(prop),
              args,
            );
            const originalFn = targetObj[prop] as (...a: unknown[]) => unknown;

            try {
              const result = originalFn.apply(targetObj, args);

              if (result instanceof Promise) {
                return result.then(
                  (resolved: unknown) => {
                    const { wrapped, serialized } = wrapNested(resolved, obj.store);
                    obj.store.record(callKey, {
                      args: args.map((a: unknown) => serialize(a)),
                      result: serialized,
                    });
                    return wrapped;
                  },
                  (error: Error) => {
                    obj.store.record(callKey, {
                      args: args.map((a: unknown) => serialize(a)),
                      result: { t: 'undefined' },
                      error: serialize(error),
                    });
                    throw error;
                  },
                );
              }

              const { wrapped, serialized } = wrapNested(result, obj.store);
              obj.store.record(callKey, {
                args: args.map((a: unknown) => serialize(a)),
                result: serialized,
              });
              return wrapped;
            } catch (e: unknown) {
              obj.store.record(callKey, {
                args: args.map((a: unknown) => serialize(a)),
                result: { t: 'undefined' },
                error: serialize(e),
              });
              throw e;
            }
          };
        }

        return targetObj[prop];
      },
    });
  }
}

function hasMethods(value: unknown): value is object {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date || value instanceof RegExp) return false;
  if (Buffer.isBuffer(value)) return false;
  if (value instanceof Error) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return true;
  for (const key of Object.keys(value)) {
    if (typeof (value as Record<string, unknown>)[key] === 'function') return true;
  }
  return false;
}

function wrapNested(
  result: unknown,
  store: SnapshotStore,
): { wrapped: unknown; serialized: SerializedValue } {
  if (hasMethods(result)) {
    const refId = `obj_${store.className}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    return {
      wrapped: new ConnectionHandler(result, refId, store),
      serialized: { t: 'ref', v: refId },
    };
  }
  return { wrapped: result, serialized: serialize(result) };
}
