import type { MockableOptions, SerializedValue } from './interfaces';
import type { SnapshotStore } from './snapshot-store';
import { getSnapshotStore } from './snapshot-store';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockReplayMissError } from './errors';
import { ConnectionHandler } from './connection-proxy';
import { hasMethods, nextRefId, collectOwnDescriptors } from './utils';
import {
  MODE_REPLAY,
  T_REF,
  T_UNDEFINED,
  T_CALLBACK,
  PROP_CONSTRUCTOR,
  PREFIX_CB,
  MARKER_CALLBACK,
  STATIC_SAFE,
} from './constants';

const refIdCache = new WeakMap<object, string>();

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
 *   - Connection return values (objects with methods) are wrapped in {@link ConnectionHandler}
 *     so subsequent calls on them are also recorded/replayed.
 *   - Supports static method wrapping via {@link MockableOptions.wrapStatics}.
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
    const store = getSnapshotStore(className, options?.snapshotDir);

    patchPrototype(Base.prototype, store);

    if (options?.wrapStatics) {
      wrapStaticMethods(Base, store);
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
 * @description Creates a wrapped function that intercepts calls for recording or replaying.
 *   Shared factory used by both instance methods ({@link wrapMethod}) and static methods
 *   ({@link wrapStaticMethod}).
 *
 * @param name - method name (used in call key)
 * @param original - original implementation
 * @param store - snapshot store instance
 * @param recordResult - callback that serialises and stores the result (behaviour differs
 *   for instance vs static methods)
 */
function makeMethodWrapper(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
  recordResult: (
    store: SnapshotStore,
    callKey: string,
    result: unknown,
    sa: SerializedValue[],
  ) => unknown,
): (...args: unknown[]) => unknown {
  return function (this: unknown, ...args: unknown[]) {
    const mode = store.mode;
    const reportArgs = args.map((a) => (typeof a === 'function' ? MARKER_CALLBACK : a));
    const callKey = makeCallKey('', name, reportArgs);

    if (mode === MODE_REPLAY) return replayCall(callKey, name, args, store);

    const { recordedArgs, callbackRecords } = recordPrep(args);

    try {
      const result = original.apply(this, recordedArgs);

      if (result instanceof Promise) {
        return result.then(
          (resolved: unknown) => {
            const sa = serializeArgs(recordedArgs, callbackRecords);
            return recordResult(store, callKey, resolved, sa);
          },
          (error: Error) => {
            const sa = serializeArgs(recordedArgs, callbackRecords);
            store.record(callKey, {
              args: sa,
              result: { t: T_UNDEFINED },
              error: serialize(error),
            });
            throw error;
          },
        );
      }

      const sa = serializeArgs(recordedArgs, callbackRecords);
      return recordResult(store, callKey, result, sa);
    } catch (e: unknown) {
      const sa = serializeArgs(recordedArgs, callbackRecords);
      store.record(callKey, {
        args: sa,
        result: { t: T_UNDEFINED },
        error: serialize(e as Error),
      });
      throw e;
    }
  };
}

/**
 * @description Wraps an instance method: in record mode stores results via {@link wrapAndRecord}
 *   (which creates {@link ConnectionHandler} for object returns); in replay mode looks up
 *   the snapshot entry.
 */
function wrapMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(name, original, store, wrapAndRecord);
}

/**
 * @description Wraps a static method: in record mode stores the plain serialised result
 *   (without ConnectionHandler wrapping); in replay mode looks up the snapshot entry.
 */
function wrapStaticMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(name, original, store, recordStaticResult);
}

/**
 * @description Replays a recorded call from the snapshot store.
 *   - Returns the deserialised result.
 *   - If the result was a `'ref'`, returns a new {@link ConnectionHandler} with the stored refId.
 *   - If the call originally threw, re-throws the deserialised error.
 *   - If callback arguments were recorded, replays their invocations.
 *
 * @throws {@link UnimockReplayMissError} when no entry is found for the call key
 */
function replayCall(
  callKey: string,
  name: string,
  args: unknown[],
  store: SnapshotStore,
): unknown {
  const entry = store.get(callKey);
  if (!entry) throw new UnimockReplayMissError(callKey, name, args);

  if (entry.error) throw deserialize(entry.error) as Error;

  const promises = replayCallbacks(entry.args, args);

  if (entry.result.t === T_REF) {
    const conn = new ConnectionHandler(null, entry.result.v, store);
    if (promises.length > 0) return Promise.all(promises).then(() => conn);
    return conn;
  }

  const result = deserialize(entry.result);
  if (promises.length > 0) return Promise.all(promises).then(() => result);
  return result;
}

/**
 * @description Replays recorded callback invocations.
 *   For each serialised arg that is a `'callback'` type, invokes the corresponding
 *   function from `originalArgs` with the recorded arguments. Returns an array of promises
 *   for any async callbacks.
 */
function replayCallbacks(
  serializedArgs: SerializedValue[],
  originalArgs: unknown[],
): Promise<unknown>[] {
  const promises: Promise<unknown>[] = [];
  for (let i = 0; i < serializedArgs.length; i++) {
    const sa = serializedArgs[i];
    if (sa.t === 'callback' && typeof originalArgs[i] === 'function') {
      const fn = originalArgs[i] as (...a: unknown[]) => unknown;
      for (const recording of sa.v.recording) {
        const p = fn(...recording.map((r) => deserialize(r as SerializedValue)));
        if (p instanceof Promise) promises.push(p);
      }
    }
  }
  return promises;
}

/**
 * @description Prepares arguments for recording. Replaces each function argument with a wrapped
 *   version that records its invocations. Returns the modified args array and the collected
 *   callback records.
 */
function recordPrep(args: unknown[]): {
  recordedArgs: unknown[];
  callbackRecords: Array<{
    index: number;
    records: unknown[][];
    fn: (...a: unknown[]) => unknown;
  }>;
} {
  const callbackRecords: Array<{
    index: number;
    records: unknown[][];
    fn: (...a: unknown[]) => unknown;
  }> = [];
  const recordedArgs = args.map((arg, i) => {
    if (typeof arg === 'function') {
      const records: unknown[][] = [];
      const wrapped = (...cbArgs: unknown[]) => {
        records.push(cbArgs);
        return (arg as (...a: unknown[]) => unknown)(...cbArgs);
      };
      callbackRecords.push({
        index: i,
        records,
        fn: arg as (...a: unknown[]) => unknown,
      });
      return wrapped;
    }
    return arg;
  });
  return { recordedArgs, callbackRecords };
}

/**
 * @description Serialises call arguments, embedding callback recordings into `'callback'`-typed
 *   entries. Functions that were not wrapped are serialised as a plain string marker.
 */
function serializeArgs(
  recordedArgs: unknown[],
  callbacks: Array<{
    index: number;
    records: unknown[][];
    fn: (...a: unknown[]) => unknown;
  }>,
): SerializedValue[] {
  return recordedArgs.map((a, i) => {
    if (typeof a === 'function') {
      const cb = callbacks.find((c) => c.index === i);
      if (cb) {
        return {
          t: T_CALLBACK,
          v: {
            callRef: nextRefId(PREFIX_CB),
            recording: cb.records.map((rec) => rec.map((arg) => serialize(arg))),
          },
        };
      }
    }
    return serialize(a);
  });
}

/**
 * @description Records a method call result. If the result is an object with methods
 *   (detected by {@link hasMethods}), wraps it in a {@link ConnectionHandler} and stores
 *   a reference (`'ref'`). Otherwise stores the plain serialised value.
 *   Uses a {@link WeakMap} cache to reuse the same refId for repeated calls
 *   returning the same target object (deduplicates `conn:*` snapshot entries).
 */
function wrapAndRecord(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
): unknown {
  if (hasMethods(result)) {
    let refId = refIdCache.get(result);
    if (!refId) {
      refId = nextRefId();
      refIdCache.set(result, refId);
    }
    const wrapped = new ConnectionHandler(result, refId, store);
    store.record(callKey, {
      args: serializedArgs,
      result: { t: T_REF, v: refId },
      error: undefined,
    });
    return wrapped;
  }
  store.record(callKey, {
    args: serializedArgs,
    result: serialize(result),
    error: undefined,
  });
  return result;
}

// TODO: sequelize models static methods, need to be configurable...

/**
 * @description Wraps static methods listed in {@link STATIC_SAFE} on the decorated class.
 *   Iterates the prototype chain up to `Function.prototype` and wraps matching methods.
 */
function wrapStaticMethods(
  klass: new (...args: unknown[]) => object,
  store: SnapshotStore,
): void {
  const entries = collectOwnDescriptors(Object.getPrototypeOf(klass), Function.prototype, {
    skipKeys: new Set([PROP_CONSTRUCTOR, 'prototype', 'name', 'length']),
    filter: (key, descriptor) =>
      STATIC_SAFE.has(key) && typeof descriptor.value === 'function',
  });

  for (const { key, descriptor } of entries) {
    Object.defineProperty(klass, key, {
      value: wrapStaticMethod(key, descriptor.value as (...args: unknown[]) => unknown, store),
      writable: true,
      configurable: true,
    });
  }
}

/**
 * @description Records a static method call result (without ConnectionHandler wrapping).
 *   If the result has a `.toJSON()` method, it is called first to produce a plain value.
 */
function recordStaticResult(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
): unknown {
  const data = toPlain(result);
  store.record(callKey, {
    args: serializedArgs,
    result: serialize(data),
    error: undefined,
  });
  return result;
}

/**
 * @description Converts a value to a plain object by calling its `.toJSON()` method if available.
 */
function toPlain(value: unknown): unknown {
  if (value && typeof value === 'object' && typeof (value as any).toJSON === 'function') {
    return (value as any).toJSON();
  }
  return value;
}

/**
 * @description Wraps a getter for snapshot recording/replay.
 *   In record mode, calls the original getter and wraps the result if it has methods.
 *   In replay mode, returns the recorded value directly.
 *   Caches refIds via {@link refIdCache} to avoid duplicate entries for the same target object.
 */
function wrapGetter(
  name: string,
  original: () => unknown,
  store: SnapshotStore,
): () => unknown {
  return function (this: unknown) {
    const callKey = makeCallKey('', name, []);
    const mode = store.mode;

    if (mode === MODE_REPLAY) {
      const entry = store.get(callKey);
      if (!entry) throw new UnimockReplayMissError(callKey, name, []);
      if (entry.result.t === T_REF)
        return new ConnectionHandler(null, entry.result.v, store);
      return deserialize(entry.result);
    }

    const result = original.call(this);
    if (hasMethods(result)) {
      let refId = refIdCache.get(result);
      if (!refId) {
        refId = nextRefId();
        refIdCache.set(result, refId);
      }
      const wrapped = new ConnectionHandler(result, refId, store);
      store.record(callKey, { args: [], result: { t: T_REF, v: refId } });
      return wrapped;
    }
    store.record(callKey, { args: [], result: serialize(result) });
    return result;
  };
}
