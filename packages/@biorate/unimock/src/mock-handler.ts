import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue, SnapshotCall } from './interfaces';
import { isReplay, isRecord } from './snapshot-store';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockProxyTargetRequiredError } from './errors';
import {
  T_REF,
  T_OBJECT,
  PROP_THEN,
  PROP_UNIMOCK_REF,
  PROP_PRIVATE_PREFIX,
  PREFIX_CALL,
  PREFIX_PROP,
} from './constants';
import { skipProxyArgsEnabled } from './env';
import {
  hasMethods,
  getOrAssignRefId,
  getUnimockRef,
  isPromiseLike,
  getReplayEntry,
  recordError,
} from './utils';

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

  private readonly store: SnapshotStore;
  private readonly target: unknown;

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

        if (isReplay()) return obj.#replayGet(prop);

        if (isRecord()) return obj.#recordGet(prop);

        const targetObj = obj.target as Record<string | symbol, unknown> | null;
        if (!targetObj) throw new UnimockProxyTargetRequiredError(obj.__unimock_ref__);
        return targetObj[prop];
      },
    });
  }

  /**
   * @description Replay-mode property access. Property entries (recorded `prop:` keys) win
   *   over method calls; otherwise a callable is returned that looks the `call:{refId}:` key
   *   up in the snapshot store. `next` gets iterator-sequence semantics.
   */
  #replayGet(prop: string | symbol): unknown {
    const propKey = `${PREFIX_PROP}${this.__unimock_ref__}:${String(prop)}:`;
    const propEntry = this.store.get(propKey);
    if (propEntry) {
      const result = deserialize(propEntry.result);
      if (hasMethods(result))
        return new MockHandler(
          result,
          getOrAssignRefId(result),
          this.store,
          this.__unimock_depth__ + 1,
        );
      return result;
    }

    return (...args: unknown[]) => {
      const name = String(prop);
      const callKey = makeCallKey(`${PREFIX_CALL}${this.__unimock_ref__}:`, name, args);
      if (name === 'next')
        return replayIteratorNext(this, callKey, this.store, this.__unimock_depth__);
      const entry = getReplayEntry(this.store, callKey, name, args);
      if (entry.result.t === T_REF)
        return new MockHandler(
          null,
          entry.result.v,
          this.store,
          this.__unimock_depth__ + 1,
        );
      return deserialize(entry.result);
    };
  }

  /**
   * @description Record-mode property access. Function properties become wrapper functions
   *   that call the real target, record the `call:{refId}:` entry and wrap the result via
   *   {@link wrapNested}; plain properties are recorded as `prop:` entries and returned as-is.
   */
  #recordGet(prop: string | symbol): unknown {
    const targetObj = this.target as Record<string | symbol, unknown> | null;
    if (!targetObj) throw new UnimockProxyTargetRequiredError(this.__unimock_ref__);

    if (typeof targetObj[prop] === 'function') {
      const name = String(prop);
      const originalFn = targetObj[prop] as (...a: unknown[]) => unknown;

      return (...args: unknown[]) => {
        const callKey = makeCallKey(`${PREFIX_CALL}${this.__unimock_ref__}:`, name, args);
        const recArgs = skipProxyArgsEnabled()
          ? []
          : args.map((a: unknown) => serialize(a, undefined, this.store.symbols));

        let rawResult: unknown;
        try {
          rawResult = originalFn.apply(targetObj, args);
        } catch (e: unknown) {
          return recordError(this.store, callKey, recArgs, e);
        }

        if (isPromiseLike(rawResult)) {
          const then = (rawResult as { then: (...a: unknown[]) => unknown }).then;
          return then.call(
            rawResult,
            (resolved: unknown) => {
              const { wrapped, serialized } = wrapNested(
                resolved,
                this.store,
                this.__unimock_depth__,
              );
              this.store.record(callKey, { args: recArgs, result: serialized });
              return wrapped;
            },
            (error: Error) => recordError(this.store, callKey, recArgs, error),
          );
        }

        const { wrapped, serialized } = wrapNested(
          rawResult,
          this.store,
          this.__unimock_depth__,
        );
        this.store.record(callKey, { args: recArgs, result: serialized });
        return wrapped;
      };
    }

    const propKey = `${PREFIX_PROP}${this.__unimock_ref__}:${String(prop)}:`;
    const value = targetObj[prop];
    this.store.record(propKey, {
      args: [],
      result: serialize(value, undefined, this.store.symbols),
    });

    return value;
  }
}

/**
 * @description Per-iterator-instance call counter for replayed `next()` calls. Each replayed
 *   iterator proxy instance replays the recorded `next()` sequence from the beginning.
 */
const iteratorNextCounters = new WeakMap<object, number>();

function isIteratorResult(v: SerializedValue): boolean {
  if (v.t !== T_OBJECT || !Array.isArray(v.v)) return false;
  return v.v.some((entry) => entry.k === 'done');
}

function unwrapEntry(entry: SnapshotCall, store: SnapshotStore, depth: number): unknown {
  if (entry.result.t === T_REF)
    return new MockHandler(null, entry.result.v, store, depth + 1);
  return deserialize(entry.result);
}

/**
 * @description Replays an iterator protocol `next()` call as the ordered sequence of its
 *   recorded results (per iterator instance), returning a synthetic
 *   `{ value: undefined, done: true }` once the sequence is exhausted.
 *
 *   Iterators are stateful: a stateless last-wins replay would repeat the last recorded
 *   result forever when the recorded iteration was interrupted early (return/break) and no
 *   `done: true` entry was recorded, producing an infinite loop in the replaying test.
 *
 *   Non-iterator methods named `next` (recorded results without a `done` property) keep the
 *   legacy last-wins behaviour.
 */
function replayIteratorNext(
  handler: object,
  callKey: string,
  store: SnapshotStore,
  depth: number,
): unknown {
  const legacy = getReplayEntry(store, callKey, 'next', []);
  if (!isIteratorResult(legacy.result)) return unwrapEntry(legacy, store, depth);

  const idx = iteratorNextCounters.get(handler) ?? 0;
  iteratorNextCounters.set(handler, idx + 1);

  const len = store.sequenceLength(callKey);
  if (len === 0) return unwrapEntry(legacy, store, depth);
  if (idx >= len) return { value: undefined, done: true };

  const entry = store.getAt(callKey, idx);
  if (!entry) return unwrapEntry(legacy, store, depth);
  return unwrapEntry(entry, store, depth);
}

/**
 * @description Wraps a result value in a {@link MockHandler} if it has methods,
 *   otherwise returns it as-is with its plain serialised form. Caches refIds via the
 *   shared refId cache ({@link getOrAssignRefId}) so repeated calls returning the same
 *   object reuse the same refId.
 *   Respects {@link SnapshotStore.depth} — when `depth >= store.depth` the result
 *   is serialised directly without wrapping.
 */
function wrapNested(
  result: unknown,
  store: SnapshotStore,
  depth = 0,
): { wrapped: unknown; serialized: SerializedValue } {
  const nestedRef = getUnimockRef(result);
  if (nestedRef !== undefined) {
    return { wrapped: result, serialized: { t: T_REF, v: nestedRef } };
  }
  if (depth >= store.depth) {
    return { wrapped: result, serialized: serialize(result, undefined, store.symbols) };
  }
  if (hasMethods(result)) {
    const refId = getOrAssignRefId(result);
    return {
      wrapped: new MockHandler(result, refId, store, depth + 1),
      serialized: { t: T_REF, v: refId },
    };
  }
  return { wrapped: result, serialized: serialize(result, undefined, store.symbols) };
}
