import type { SerializedValue } from './interfaces';
import type { SnapshotStore } from './snapshot-store';
import { isOff, isReplay, isRecord } from './snapshot-store';
import { fallbackOnMissEnabled } from './env';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockReplayMissError } from './errors';
import { MockHandler } from './mock-handler';
import {
  hasMethods,
  nextRefId,
  getRefId,
  getOrAssignRefId,
  getUnimockRef,
  isPromiseLike,
  recordError,
} from './utils';
import { inReconstruction, replayRebuilt } from './state';
import {
  T_REF,
  T_CALLBACK,
  PREFIX_CB,
  PREFIX_CALL,
  MARKER_CALLBACK,
} from './constants';

/**
 * @description Runtime configuration of a {@link MethodWrapper}.
 *
 *   `recordResult` serialises and stores the result (behaviour differs for instance vs
 *   static methods); `replayOverride` optionally customises replay (static methods use it
 *   to rebuild model instances). When `replayOverride` is omitted the standard
 *   {@link replayCall} is used.
 */
export interface MethodWrapperConfig {
  name: string;
  original: (...args: unknown[]) => unknown;
  store: SnapshotStore;
  recordResult: (
    store: SnapshotStore,
    callKey: string,
    result: unknown,
    sa: SerializedValue[],
  ) => unknown;
  replayOverride?: (
    thisArg: unknown,
    callKey: string,
    name: string,
    args: unknown[],
    store: SnapshotStore,
  ) => unknown;
}

/**
 * @description Wrapped implementation of a single prototype/static method that intercepts
 *   calls for recording or replaying.
 *
 *   Fast paths, in order: {@link isOff} (T1 zero-overhead invariant) →
 *   {@link inReconstruction} (replay reconstruction — pass through to the original before
 *   any hashing/lookup; see the `reconstructionDepth` docs in state.ts).
 *
 *   The call key is prefixed with {@link connectionPrefix} in BOTH record and replay
 *   branches, so calls on identity-carrying instances produce/resume the same keys as
 *   {@link MockHandler}-mediated calls on the same object.
 */
export class MethodWrapper {
  private readonly config: Required<Pick<MethodWrapperConfig, 'name' | 'original' | 'store' | 'recordResult'>> &
    Pick<MethodWrapperConfig, 'replayOverride'>;

  constructor(config: MethodWrapperConfig) {
    this.config = config;
  }

  public wrap(): (...args: unknown[]) => unknown {
    const { name, original, store, recordResult, replayOverride } = this.config;
    return function (this: unknown, ...args: unknown[]) {
      if (isOff()) return original.apply(this, args);

      if (inReconstruction()) return original.apply(this, args);

      const reportArgs = args.map((a) => (typeof a === 'function' ? MARKER_CALLBACK : a));
      const callKey = makeCallKey(connectionPrefix(this), name, reportArgs);

      if (isReplay()) {
        try {
          if (replayOverride) return replayOverride(this, callKey, name, args, store);
          return replayCall(callKey, name, args, store);
        } catch (e) {
          // Fall back to the original implementation when UNIMOCK_FALLBACK_ON_MISS=1 is set:
          // a replay miss must not crash the process (recorded flows can legitimately diverge,
          // e.g. query caches or file order); the original executes against the real
          // backend. Without the flag the previous strict behaviour is kept.
          if (e instanceof UnimockReplayMissError && fallbackOnMissEnabled())
            return original.apply(this, args);
          // Only replay-rebuilt, unregistered instances fall back to their own recorded
          // data (Sequelize attribute getters). Everything else stays strict.
          if (
            e instanceof UnimockReplayMissError &&
            replayRebuilt.has(this as object) &&
            getRefId(this as object) === undefined
          )
            return original.apply(this, args);
          throw e;
        }
      }
      if (!isRecord()) return original.apply(this, args);

      const { recordedArgs, callbackRecords } = recordPrep(args);

      try {
        const result = original.apply(this, recordedArgs);

        if (isPromiseLike(result)) {
          return result.then(
            (resolved: unknown) => {
              const sa = serializeArgs(recordedArgs, callbackRecords, store.symbols);
              return recordResult(store, callKey, resolved, sa);
            },
            (error: Error) =>
              recordError(
                store,
                callKey,
                serializeArgs(recordedArgs, callbackRecords, store.symbols),
                error,
              ),
          );
        }

        const sa = serializeArgs(recordedArgs, callbackRecords, store.symbols);
        return recordResult(store, callKey, result, sa);
      } catch (e: unknown) {
        return recordError(
          store,
          callKey,
          serializeArgs(recordedArgs, callbackRecords, store.symbols),
          e,
        );
      }
    };
  }
}

/**
 * @description Call-key prefix that scopes an instance method/getter to the unimock
 *   identity of `thisArg`, using the EXACT {@link MockHandler} connection convention
 *   (`call:{refId}:` — see mock-handler.ts). Returns `''` for objects without an
 *   assigned identity, so those keep the legacy unscoped key.
 *
 *   Scoping rule: a call is scoped iff unimock itself assigned `this` an identity
 *   (via `wrapResult` or `assignStaticRefs`).
 */
function connectionPrefix(thisArg: unknown): string {
  if (!thisArg || typeof thisArg !== 'object') return '';
  const refId = getRefId(thisArg);
  return refId ? `${PREFIX_CALL}${refId}:` : '';
}

/**
 * @description Wraps an instance method: in record mode stores results via {@link wrapResult}
 *   (which creates {@link MockHandler} for object returns); in replay mode looks up
 *   the snapshot entry.
 */
export function wrapMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return new MethodWrapper({
    name,
    original,
    store,
    recordResult: wrapResult,
  }).wrap();
}

/**
 * @description Replays a recorded call from the snapshot store.
 *   - Returns the deserialised result.
 *   - If the result was a `'ref'`, returns a new {@link MockHandler} with the stored refId.
 *   - If the call originally threw, re-throws the deserialised error.
 *   - If callback arguments were recorded, replays their invocations.
 *
 * @throws {@link UnimockReplayMissError} when no entry is found for the call key
 */
export function replayCall(
  callKey: string,
  name: string,
  args: unknown[],
  store: SnapshotStore,
): unknown {
  const entry = store.nextReplayEntry(callKey);
  if (!entry) throw new UnimockReplayMissError(callKey, name, args);
  if (entry.error) throw deserialize(entry.error);

  const promises = replayCallbacks(entry.args, args);

  if (entry.result.t === T_REF) {
    const handler = new MockHandler(null, entry.result.v, store);
    if (promises.length > 0) return Promise.all(promises).then(() => handler);
    return handler;
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
export function replayCallbacks(
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
export function recordPrep(args: unknown[]): {
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
    const isCtor =
      typeof arg === 'function' &&
      Object.getOwnPropertyDescriptor(arg, 'prototype')?.writable === false;
    if (typeof arg === 'function' && !isCtor) {
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
export function serializeArgs(
  recordedArgs: unknown[],
  callbacks: Array<{
    index: number;
    records: unknown[][];
    fn: (...a: unknown[]) => unknown;
  }>,
  symbols?: boolean,
): SerializedValue[] {
  return recordedArgs.map((a, i) => {
    if (typeof a === 'function') {
      const cb = callbacks.find((c) => c.index === i);
      if (cb) {
        return {
          t: T_CALLBACK,
          v: {
            callRef: nextRefId(PREFIX_CB),
            recording: cb.records.map((rec) =>
              rec.map((arg) => serialize(arg, undefined, symbols)),
            ),
          },
        };
      }
    }
    return serialize(a, undefined, symbols);
  });
}

/**
 * @description Records a method result in record mode, wrapping objects that expose methods
 *   in a {@link MockHandler} and returning the wrapped instance. Non-object results are
 *   serialised as-is. If `result` is already MockHandler-wrapped, its existing refId is
 *   reused (no double-marking). Resurfaces the original (unwrapped) result unchanged.
 */
export function wrapResult(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
  depth = 0,
): unknown {
  const existingRef = getUnimockRef(result);
  if (existingRef !== undefined) {
    store.record(callKey, {
      args: serializedArgs,
      result: { t: T_REF, v: existingRef },
    });
    return result;
  }
  if (depth >= store.depth) {
    store.record(callKey, {
      args: serializedArgs,
      result: serialize(result, undefined, store.symbols),
    });
    return result;
  }
  if (hasMethods(result)) {
    const refId = getOrAssignRefId(result);
    const wrapped = new MockHandler(result, refId, store, depth + 1);
    store.record(callKey, {
      args: serializedArgs,
      result: { t: T_REF, v: refId },
    });
    return wrapped;
  }
  store.record(callKey, {
    args: serializedArgs,
    result: serialize(result, undefined, store.symbols),
  });
  return result;
}

/**
 * @description Wraps a getter for snapshot recording/replay.
 *   In record mode, calls the original getter and wraps the result if it has methods.
 *   In replay mode, returns the recorded value directly.
 *   Caches refIds via the shared {refIdCache} to avoid duplicate entries for the same target
 *   object.
 *   The call key uses {@link connectionPrefix}, so getters on identity-carrying
 *   instances are recorded/replayed per-instance.
 */
export function wrapGetter(
  name: string,
  original: () => unknown,
  store: SnapshotStore,
): () => unknown {
  return function (this: unknown) {
    if (isOff()) return original.call(this);

    if (inReconstruction()) return original.call(this);

    const callKey = makeCallKey(connectionPrefix(this), name, []);

    if (isReplay()) {
      try {
        const entry = store.nextReplayEntry(callKey);
        if (!entry) throw new UnimockReplayMissError(callKey, name, []);
        if (entry.error) throw deserialize(entry.error);
        if (entry.result.t === T_REF) return new MockHandler(null, entry.result.v, store);
        return deserialize(entry.result);
      } catch (e) {
        if (e instanceof UnimockReplayMissError && fallbackOnMissEnabled())
          return original.call(this);
        throw e;
      }
    }
    if (!isRecord()) return original.call(this);

    return wrapResult(store, callKey, original.call(this), []);
  };
}