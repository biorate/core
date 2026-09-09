import { flattenDeep } from 'lodash-es';
import type { MockableOptions, SerializedValue, SnapshotCall } from './interfaces';
import type { SnapshotStore } from './snapshot-store';
import { getSnapshotStore, isOff, isReplay, isRecord } from './snapshot-store';
import { makeCallKey, serialize, deserialize, stableHash } from './serializer';
import { MockHandler } from './mock-handler';
import {
  hasMethods,
  nextRefId,
  collectOwnDescriptors,
  getReplayEntry,
  recordError,
} from './utils';
import {
  T_REF,
  T_CALLBACK,
  PROP_CONSTRUCTOR,
  PROP_UNIMOCK_REF,
  PREFIX_CB,
  PREFIX_CALL,
  MARKER_CALLBACK,
} from './constants';

const refIdCache = new WeakMap<object, string>();

/**
 * @description Original (pre-wrap) implementations of wrapped static methods, keyed by class.
 *   Captured in {@link wrapStaticMethods} before `Object.defineProperty` replaces them.
 *   Replay reconstruction MUST use the original `build` — the wrapped one routes into a
 *   replay lookup for reconstruction args that were never recorded and would throw
 *   {@link UnimockReplayMissError}.
 */
const staticOriginals = new WeakMap<
  object,
  Map<string, (...args: unknown[]) => unknown>
>();

/**
 * @description Depth counter of in-flight replay reconstructions ({@link rebuildInstance}).
 *   While `> 0`, wrapped instance methods and getters must NOT touch the snapshot store:
 *   during replay reconstruction the vanilla constructor re-enters wrapped prototype
 *   methods (e.g. Sequelize `_initValues`) with options that record mode never produced
 *   (recon `{ isNewRecord: false, _schema: null, _schemaDelimiter: '' }` vs hydration
 *   `{ raw: true, attributes: [...] }`), so a replay lookup would miss with
 *   {@link UnimockReplayMissError}. The call passes through to the original instead —
 *   instance state is populated by the model's own constructor; post-construction calls
 *   (`toJSON`/`get`/…) are served from the recorded `call:{refId}:` entries once
 *   {@link registerStaticRefs} binds the rebuilt instances under their recorded refIds.
 */
let reconstructionDepth = 0;

/** @description Replay result shape of a known static method (see {@link STATIC_REPLAY_SHAPE}). */
type StaticReplayShape =
  | 'chain'
  | 'single'
  | 'array'
  | 'pairInstance'
  | 'pairCount'
  | 'wrapper';

/**
 * @description Replay result-shape classification for known Sequelize-style statics.
 *   - `chain`: the static returns the class itself (`scope`/`unscoped`/`schema`) — replay returns the class.
 *   - `single`: one model instance (`create`/`findOne`/`findByPk`/`build`).
 *   - `array`: array of model instances (`findAll`/`bulkCreate`/`bulkBuild`).
 *   - `pairInstance`: `[instance, boolean]` (`findOrCreate`/`findOrBuild`/`findCreateFind`/`upsert`).
 *   - `pairCount`: `[count, instances[]]` (`update`).
 *   - `wrapper`: `{ count, rows: instances[] }` (`findAndCountAll`).
 *   - not listed: deserialized data as-is (legacy behavior).
 */
const STATIC_REPLAY_SHAPE: Record<string, StaticReplayShape> = {
  scope: 'chain',
  unscoped: 'chain',
  schema: 'chain',
  create: 'single',
  findOne: 'single',
  findByPk: 'single',
  build: 'single',
  findAll: 'array',
  bulkCreate: 'array',
  bulkBuild: 'array',
  findOrCreate: 'pairInstance',
  findOrBuild: 'pairInstance',
  findCreateFind: 'pairInstance',
  upsert: 'pairInstance',
  update: 'pairCount',
  findAndCountAll: 'wrapper',
};

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
 * @description Call-key prefix that scopes an instance method/getter to the unimock
 *   identity of `thisArg`, using the EXACT {@link MockHandler} connection convention
 *   (`call:{refId}:` — see mock-handler.ts). Returns `''` for objects without an
 *   assigned identity, so those keep the legacy unscoped key.
 *
 *   Scoping rule: a call is scoped iff unimock itself assigned `this` an identity
 *   (via {@link wrapResult} or {@link assignStaticRefs}).
 */
function connectionPrefix(thisArg: unknown): string {
  if (!thisArg || typeof thisArg !== 'object') return '';
  const refId = refIdCache.get(thisArg);
  return refId ? `${PREFIX_CALL}${refId}:` : '';
}

/**
 * @description Creates a wrapped function that intercepts calls for recording or replaying.
 *   Shared factory used by both instance methods ({@link wrapMethod}) and static methods
 *   ({@link wrapStaticMethod}).
 *
 *   Fast paths, in order: `isOff()` (T1 zero-overhead invariant) →
 *   {@link reconstructionDepth} > 0 (replay reconstruction — pass through to the original
 *   before any hashing/lookup; see its TSDoc).
 *
 *   The call key is prefixed with {@link connectionPrefix} in BOTH record and replay
 *   branches, so calls on identity-carrying instances produce/resume the same keys as
 *   {@link MockHandler}-mediated calls on the same object.
 *
 * @param name - method name (used in call key)
 * @param original - original implementation
 * @param store - snapshot store instance
 * @param recordResult - callback that serialises and stores the result (behaviour differs
 *   for instance vs static methods)
 * @param replayOverride - optional custom replay handler (static methods use it to rebuild
 *   model instances); when omitted the standard {@link replayCall} is used
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
  replayOverride?: (
    thisArg: unknown,
    callKey: string,
    name: string,
    args: unknown[],
    store: SnapshotStore,
  ) => unknown,
): (...args: unknown[]) => unknown {
  return function (this: unknown, ...args: unknown[]) {
    if (isOff()) return original.apply(this, args);

    if (reconstructionDepth > 0) return original.apply(this, args);

    const reportArgs = args.map((a) => (typeof a === 'function' ? MARKER_CALLBACK : a));
    const callKey = makeCallKey(connectionPrefix(this), name, reportArgs);

    if (isReplay()) {
      return replayOverride
        ? replayOverride(this, callKey, name, args, store)
        : replayCall(callKey, name, args, store);
    }
    if (!isRecord()) return original.apply(this, args);

    const { recordedArgs, callbackRecords } = recordPrep(args);

    try {
      const result = original.apply(this, recordedArgs);

      if (result instanceof Promise) {
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

/**
 * @description Wraps an instance method: in record mode stores results via {@link wrapAndRecord}
 *   (which creates {@link MockHandler} for object returns); in replay mode looks up
 *   the snapshot entry.
 */
function wrapMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(name, original, store, wrapResult);
}

/**
 * @description Wraps a static method: in record mode stores the plain serialised result
 *   (without ConnectionHandler wrapping); in replay mode delegates to {@link replayStaticCall},
 *   which rebuilds model instances via the original static `build` when the static's
 *   return shape is known ({@link STATIC_REPLAY_SHAPE}).
 */
function wrapStaticMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
  klass: new (...args: unknown[]) => object,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(
    name,
    original,
    store,
    (st, callKey, result, sa) => recordStaticResult(name, st, callKey, result, sa),
    (_thisArg, callKey, methodName, args) =>
      replayStaticCall(klass, callKey, methodName, args, store),
  );
}

/**
 * @description Replays a recorded static call with result-shape reconstruction.
 *   - `chain`: returns the decorated class itself.
 *   - `single`/`array`/`pairInstance`/`pairCount`/`wrapper`: deserialises the recorded
 *     data and rebuilds each model element via {@link rebuildInstance}.
 *   - unknown shape: deserialised data as-is (legacy behavior).
 *   - A recorded error is re-thrown; recorded callback invocations are replayed first.
 *
 * @throws {@link UnimockReplayMissError} when no entry is found for the call key
 */
function replayStaticCall(
  klass: new (...args: unknown[]) => object,
  callKey: string,
  name: string,
  args: unknown[],
  store: SnapshotStore,
): unknown {
  const entry = getReplayEntry(store, callKey, name, args);

  const promises = replayCallbacks(entry.args, args);

  if (STATIC_REPLAY_SHAPE[name] === 'chain') {
    if (promises.length > 0) return Promise.all(promises).then(() => klass);
    return klass;
  }

  const data = deserialize(entry.result);
  let rebuilt: unknown;

  switch (STATIC_REPLAY_SHAPE[name]) {
    case 'single':
      rebuilt = rebuildInstance(klass, data);
      break;
    case 'array':
      rebuilt = Array.isArray(data) ? data.map((v) => rebuildInstance(klass, v)) : data;
      break;
    case 'pairInstance': {
      const pair = Array.isArray(data) ? data : [];
      rebuilt = [rebuildInstance(klass, pair[0]), pair[1]];
      break;
    }
    case 'pairCount': {
      const pair = Array.isArray(data) ? data : [];
      rebuilt = [
        pair[0],
        Array.isArray(pair[1])
          ? (pair[1] as unknown[]).map((v) => rebuildInstance(klass, v))
          : pair[1],
      ];
      break;
    }
    case 'wrapper': {
      const wrapper = (data ?? {}) as { rows?: unknown };
      rebuilt = {
        ...wrapper,
        rows: Array.isArray(wrapper.rows)
          ? (wrapper.rows as unknown[]).map((v) => rebuildInstance(klass, v))
          : wrapper.rows,
      };
      break;
    }
    default:
      rebuilt = data;
  }

  // Entry WITHOUT refs → legacy path above stays unchanged (old-format compat).
  // With refs → register each rebuilt instance under its recorded refId so that
  // direct instance methods/getters on it use the same scoped call keys.
  if (entry.refs !== undefined) {
    registerStaticRefs(STATIC_REPLAY_SHAPE[name], rebuilt, entry.refs);
  }

  if (promises.length > 0) return Promise.all(promises).then(() => rebuilt);
  return rebuilt;
}

/**
 * @description Registers rebuilt model instances under their recorded refIds (the `refs`
 *   markup of the static's snapshot entry), mirroring {@link MockHandler}'s resolution —
 *   which is purely key-based (`call:{refId}:` prefix, no separate registration store).
 *   Skips `undefined` entries; NEVER assigns fresh refIds in replay (reuses recorded ids
 *   only, so the refId high-water counter is never polluted by replay).
 */
function registerStaticRefs(
  shape: StaticReplayShape | undefined,
  rebuilt: unknown,
  refs: unknown,
): void {
  const set = (el: unknown, refId: unknown): void => {
    if (!refId || typeof refId !== 'string' || !el || typeof el !== 'object') return;
    refIdCache.set(el, refId);
  };

  switch (shape) {
    case 'single':
      set(rebuilt, refs);
      break;
    case 'array': {
      if (!Array.isArray(rebuilt) || !Array.isArray(refs)) return;
      for (let i = 0; i < rebuilt.length; i++) set(rebuilt[i], refs[i]);
      break;
    }
    case 'pairInstance': {
      if (!Array.isArray(rebuilt) || !Array.isArray(refs)) return;
      set(rebuilt[0], refs[0]);
      break;
    }
    case 'pairCount': {
      if (!Array.isArray(rebuilt) || !Array.isArray(rebuilt[1])) return;
      if (!Array.isArray(refs) || !Array.isArray(refs[1])) return;
      const rows = rebuilt[1] as unknown[];
      const refRows = refs[1] as unknown[];
      for (let i = 0; i < rows.length; i++) set(rows[i], refRows[i]);
      break;
    }
    case 'wrapper': {
      const rows = (rebuilt as { rows?: unknown } | null)?.rows;
      const refRows = (refs as { rows?: unknown } | null)?.rows;
      if (!Array.isArray(rows) || !Array.isArray(refRows)) return;
      for (let i = 0; i < rows.length; i++) set(rows[i], refRows[i]);
      break;
    }
    default:
      break;
  }
}

/**
 * @description Rebuilds a model instance from plain (deserialised) data using the ORIGINAL
 *   static `build` captured before wrapping: `build.call(klass, plain, { isNewRecord: false })`.
 *   The wrapped `build` is deliberately not used — in replay mode it would route into a
 *   replay lookup for reconstruction args that were never recorded and throw
 *   {@link UnimockReplayMissError}.
 *
 *   The call is made with {@link reconstructionDepth} raised so that constructor-internal
 *   wrapped prototype calls (e.g. Sequelize `_initValues`) pass through to their originals
 *   instead of doing replay lookups with reconstruction options record mode never produced.
 *
 *   Returns `plain` as-is when `build` is unavailable or `plain` is not a non-empty
 *   plain object (null, array, class instance, empty object).
 */
function rebuildInstance(
  klass: new (...args: unknown[]) => object,
  plain: unknown,
): unknown {
  const build = staticOriginals.get(klass)?.get('build') ?? (klass as any).build;
  const isPlainObject =
    plain !== null &&
    typeof plain === 'object' &&
    !Array.isArray(plain) &&
    Object.getPrototypeOf(plain) === Object.prototype &&
    Object.keys(plain).length > 0;
  if (typeof build === 'function' && isPlainObject) {
    reconstructionDepth += 1;
    try {
      return build.call(klass, plain, { isNewRecord: false });
    } finally {
      reconstructionDepth -= 1;
    }
  }
  return plain;
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
function replayCall(
  callKey: string,
  name: string,
  args: unknown[],
  store: SnapshotStore,
): unknown {
  const entry = getReplayEntry(store, callKey, name, args);

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
function serializeArgs(
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

function wrapResult(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
  depth = 0,
): unknown {
  if ((result as any)?.[PROP_UNIMOCK_REF]) {
    store.record(callKey, {
      args: serializedArgs,
      result: { t: T_REF, v: (result as any)[PROP_UNIMOCK_REF] },
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
    let refId = refIdCache.get(result);
    if (!refId) {
      refId = nextRefId();
      refIdCache.set(result, refId);
    }
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
 * @description Wraps the listed static methods of a class for snapshot record/replay.
 *   Captures each original implementation into {@link staticOriginals} before replacing it,
 *   so replay reconstruction can call the original `build`.
 */
function wrapStaticMethods(
  klass: new (...args: unknown[]) => object,
  store: SnapshotStore,
  statics: string[][],
): void {
  const flat = new Set(flattenDeep(statics));

  const entries = collectOwnDescriptors(
    Object.getPrototypeOf(klass),
    Function.prototype,
    {
      skipKeys: new Set([PROP_CONSTRUCTOR, 'prototype', 'name', 'length']),
      filter: (key, descriptor) =>
        flat.has(key) && typeof descriptor.value === 'function',
    },
  );

  let originals = staticOriginals.get(klass);
  if (!originals) {
    originals = new Map<string, (...args: unknown[]) => unknown>();
    staticOriginals.set(klass, originals);
  }

  for (const { key, descriptor } of entries) {
    const original = descriptor.value as (...args: unknown[]) => unknown;
    originals.set(key, original);
    Object.defineProperty(klass, key, {
      value: wrapStaticMethod(key, original, store, klass),
      writable: true,
      configurable: true,
    });
  }
}

/**
 * @description Assigns a per-instance refId to every model element of a LIVE static
 *   result, mirroring {@link wrapResult}'s assignment (refIdCache.get/set + nextRefId) —
 *   but static results stay RAW (never MockHandler-wrapped).
 *
 *   MUST run BEFORE {@link toPlain}: toPlain's `value.toJSON()` side-effect calls hit the
 *   WRAPPED instance methods with `this` already ref'd, so they auto-record per-instance
 *   (scoped `call:{refId}:`) connection entries — desired eager capture.
 *
 *   Returns the parallel `refs` markup for the snapshot entry, shaped per
 *   {@link STATIC_REPLAY_SHAPE}: `single` → `string`; `array` → `(string|undefined)[]`;
 *   `pairInstance` → `[string|undefined, undefined]`; `pairCount` →
 *   `[undefined, (string|undefined)[]]`; `wrapper` → `{ rows: (string|undefined)[] }`.
 *   Returns `undefined` for chain/unknown shapes or when no model element was found
 *   (entry stays in the legacy format — no `refs` field).
 */
function assignStaticRefs(name: string, result: unknown): unknown {
  const shape = STATIC_REPLAY_SHAPE[name];
  if (!shape || shape === 'chain') return undefined;

  const assign = (el: unknown): string | undefined => {
    if (!el || typeof el !== 'object') return undefined;
    const existing = (el as Record<string, unknown>)[PROP_UNIMOCK_REF];
    if (typeof existing === 'string') return existing;
    if (!hasMethods(el)) return undefined;
    let refId = refIdCache.get(el);
    if (!refId) {
      refId = nextRefId();
      refIdCache.set(el, refId);
    }
    return refId;
  };

  switch (shape) {
    case 'single':
      return assign(result);
    case 'array': {
      if (!Array.isArray(result)) return undefined;
      const refs = result.map(assign);
      return refs.some((r) => r !== undefined) ? refs : undefined;
    }
    case 'pairInstance': {
      if (!Array.isArray(result)) return undefined;
      const ref = assign(result[0]);
      return ref !== undefined ? [ref, undefined] : undefined;
    }
    case 'pairCount': {
      if (!Array.isArray(result) || !Array.isArray(result[1])) return undefined;
      const rows = (result[1] as unknown[]).map(assign);
      return rows.some((r) => r !== undefined) ? [undefined, rows] : undefined;
    }
    case 'wrapper': {
      const rows = (result as { rows?: unknown } | null)?.rows;
      if (!Array.isArray(rows)) return undefined;
      const refs = rows.map(assign);
      return refs.some((r) => r !== undefined) ? { rows: refs } : undefined;
    }
    default:
      return undefined;
  }
}

/**
 * @description Records a static method call result (without ConnectionHandler wrapping).
 *   Assigns per-instance refIds to model elements first (see {@link assignStaticRefs}),
 *   then converts via {@link toPlain} (a `.toJSON()` call produces the plain value).
 *   STILL RETURNS THE RAW LIVE RESULT — callers receive real instances in record mode.
 */
function recordStaticResult(
  name: string,
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
): unknown {
  const refs = assignStaticRefs(name, result);
  const data = toPlain(result);
  const call: SnapshotCall = {
    args: serializedArgs,
    result: serialize(data, undefined, store.symbols),
    error: undefined,
  };
  if (refs !== undefined) call.refs = refs;
  store.record(callKey, call);
  return result;
}

/**
 * @description Recursively converts a value into plain JSON-ready data for static results.
 *   - `null`, primitives and functions are returned as-is.
 *   - `Date`, `RegExp`, `Buffer` and `Error` are returned as-is so the serializer keeps
 *     their native tags (`date`/`regexp`/`buffer`/`error`) — never converted via `toJSON`.
 *   - Objects exposing a `.toJSON()` method are converted via `toJSON()`
 *     (the result is NOT recursed into).
 *   - Arrays are mapped element-wise with the same rules.
 *   - Plain objects (prototype === `Object.prototype`) are rebuilt key-by-key.
 *   - Anything else (class instances without `toJSON`, null-prototype objects, `Map`, …)
 *     is returned as-is (legacy behaviour).
 */
function toPlain(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Error ||
    Buffer.isBuffer(value)
  ) {
    return value;
  }
  if (typeof (value as any).toJSON === 'function') return (value as any).toJSON();
  if (Array.isArray(value)) return value.map((item) => toPlain(item));
  if (Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      result[key] = toPlain(entry);
    }
    return result;
  }
  return value;
}

/**
 * @description Wraps a getter for snapshot recording/replay.
 *   In record mode, calls the original getter and wraps the result if it has methods.
 *   In replay mode, returns the recorded value directly.
 *   Caches refIds via {@link refIdCache} to avoid duplicate entries for the same target object.
 *   The call key uses {@link connectionPrefix}, so getters on identity-carrying
 *   instances are recorded/replayed per-instance.
 */
function wrapGetter(
  name: string,
  original: () => unknown,
  store: SnapshotStore,
): () => unknown {
  return function (this: unknown) {
    if (isOff()) return original.call(this);

    if (reconstructionDepth > 0) return original.call(this);

    const callKey = makeCallKey(connectionPrefix(this), name, []);

    if (isReplay()) {
      const entry = getReplayEntry(store, callKey, name, []);
      if (entry.result.t === T_REF) return new MockHandler(null, entry.result.v, store);
      return deserialize(entry.result);
    }
    if (!isRecord()) return original.call(this);

    return wrapResult(store, callKey, original.call(this), []);
  };
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
