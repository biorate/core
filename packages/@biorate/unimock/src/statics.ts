import { flattenDeep } from 'lodash-es';
import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue, SnapshotCall } from './interfaces';
import { serialize, deserialize } from './serializer';
import { MethodWrapper } from './method-wrapper';
import { replayCallbacks } from './method-wrapper';
import {
  hasMethods,
  getOrAssignRefId,
  setRefId,
  getUnimockRef,
  collectOwnDescriptors,
  getReplayStaticEntry,
} from './utils';
import {
  replayRebuilt,
  staticOriginals,
  withReconstructionDepth,
} from './state';
import { PROP_CONSTRUCTOR } from './constants';

/** @description Replay result shape of a known static method (see {@link STATIC_REPLAY_SHAPE}). */
export type StaticReplayShape =
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
export const STATIC_REPLAY_SHAPE: Record<string, StaticReplayShape> = {
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
 * @description Wraps a static method: in record mode stores the plain serialised result
 *   (without ConnectionHandler wrapping); in replay mode delegates to {@link replayStaticCall},
 *   which rebuilds model instances via the original static `build` when the static's
 *   return shape is known ({@link STATIC_REPLAY_SHAPE}).
 */
export function wrapStaticMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
  klass: new (...args: unknown[]) => object,
): (...args: unknown[]) => unknown {
  return new MethodWrapper({
    name,
    original,
    store,
    recordResult: (st, callKey, result, sa) => recordStaticResult(name, st, callKey, result, sa),
    replayOverride: (_thisArg, callKey, methodName, args) =>
      replayStaticCall(klass, callKey, methodName, args, store),
  }).wrap();
}

/**
 * @description Replays a recorded static call with result-shape reconstruction.
 *   - `chain`: returns the decorated class itself.
 *   - `single`/`array`/`pairInstance`/`pairCount`/`wrapper`: deserialises the recorded
 *     data and rebuilds each model element via {@link rebuildInstance}.
 *   - A recorded entry with `refs === null` marks a result that contained NO model
 *     instance at record time (e.g. a `raw: true` query returns plain rows) — replay
 *     returns the deserialised data as-is, preserving the raw/plain contract.
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
  const entry = getReplayStaticEntry(store, callKey, name, args);

  const promises = replayCallbacks(entry.args, args);

  if (STATIC_REPLAY_SHAPE[name] === 'chain') {
    if (promises.length > 0) return Promise.all(promises).then(() => klass);
    return klass;
  }

  const data = deserialize(entry.result);
  // `refs === null` marks a record-time result with no model instance (raw/plain rows);
  // entries WITHOUT a `refs` field are legacy snapshots and keep rebuilding.
  const asIs = entry.refs === null;
  let rebuilt: unknown;

  switch (STATIC_REPLAY_SHAPE[name]) {
    case 'single':
      rebuilt = asIs ? data : rebuildInstance(klass, data);
      break;
    case 'array':
      rebuilt =
        asIs || !Array.isArray(data) ? data : data.map((v) => rebuildInstance(klass, v));
      break;
    case 'pairInstance': {
      const pair = Array.isArray(data) ? data : [];
      rebuilt = asIs ? data : [rebuildInstance(klass, pair[0]), pair[1]];
      break;
    }
    case 'pairCount': {
      const pair = Array.isArray(data) ? data : [];
      rebuilt = asIs
        ? data
        : [
            pair[0],
            Array.isArray(pair[1])
              ? (pair[1] as unknown[]).map((v) => rebuildInstance(klass, v))
              : pair[1],
          ];
      break;
    }
    case 'wrapper': {
      const wrapper = (data ?? {}) as { rows?: unknown };
      const rows = Array.isArray(wrapper.rows)
        ? (wrapper.rows as unknown[]).map((v) => rebuildInstance(klass, v))
        : wrapper.rows;
      rebuilt = asIs ? data : { ...wrapper, rows };
      break;
    }
    default:
      rebuilt = data;
  }

  // Entry WITHOUT refs → legacy path above stays unchanged (old-format compat).
  // With refs → register each rebuilt instance under its recorded refId so that
  // direct instance methods/getters on it use the same scoped call keys.
  if (entry.refs !== undefined && entry.refs !== null) {
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
    setRefId(el, refId);
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
 * @description Wraps the listed static methods of a class for snapshot record/replay.
 *   Captures each original implementation into {@link staticOriginals} before replacing it,
 *   so replay reconstruction can call the original `build`.
 */
export function wrapStaticMethods(
  klass: new (...args: unknown[]) => object,
  store: SnapshotStore,
  statics: string[][],
): void {
  const flat = new Set(flattenDeep(statics));

  const entries = collectOwnDescriptors(
    Object.getPrototypeOf(klass),
    Function.prototype as object,
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
 * @description Restores a model's association map when replay re-initialised it.
 *
 *   sequelize-typescript populates `Model.associations` in `associateModels` (run once by
 *   the `Sequelize` constructor), but plain `Model#init` — which any later
 *   `new Sequelize({ models })` / `addModels` re-run triggers — resets it to `{}`. In a
 *   replay boot the model can therefore end up initialised (so `build` works and scalar
 *   attributes read) yet carry an empty `associations` map, which both
 *   `buildIncludeTree` and Sequelize's own `_setInclude` rehydration depend on.
 *
 *   The `@BelongsToMany`/`@HasMany`/… decorators store their definitions as the
 *   `sequelize:associations` class metadata, which `init` does NOT wipe. When the live
 *   map is empty but that metadata is present, re-run the instance's own
 *   `associateModels` over its registered models so the map is repopulated exactly as the
 *   original (record-mode) boot did. No-op when the map is already populated, the model is
 *   not sequelize-bound, or it has no association metadata (plain model).
 */
function ensureAssociated(klass: object): void {
  const k = klass as {
    associations?: Record<string, unknown>;
    prototype?: unknown;
    sequelize?: {
      models?: Record<string, unknown>;
      associateModels?: (models: unknown[]) => void;
    };
  };
  const existing = k.associations;
  if (existing && typeof existing === 'object' && Object.keys(existing).length > 0)
    return;
  const sequelize = k.sequelize;
  if (!sequelize || typeof sequelize.associateModels !== 'function') return;
  // `reflect-metadata` (which provides `Reflect.getMetadata`) is a peer/runtime concern of the
  // consumer, not this package — resolve it defensively so the metadata lookup degrades to a
  // no-op when the polyfill is absent.
  const reflect = Reflect as unknown as {
    getMetadata?: (key: PropertyKey, target: object) => unknown;
  };
  const meta =
    typeof reflect.getMetadata === 'function' && k.prototype
      ? reflect.getMetadata('sequelize:associations', k.prototype)
      : null;
  if (!Array.isArray(meta) || meta.length === 0) return;
  const registered = sequelize.models ? Object.values(sequelize.models) : [klass];
  try {
    sequelize.associateModels(registered);
  } catch {
    // best-effort: a model that cannot be re-associated keeps its legacy scalar-only
    // reconstruction rather than breaking the whole replay.
  }
}

/**
 * @description Synthesises the Sequelize hydration include-descriptor tree from the
 *   association aliases present in `sample` — the exact shape a real query with includes
 *   feeds into `options.include` / `options.includeMap` / `options.includeNames` when
 *   `findOne({ include })` hydrates instances (`handleSelectQuery` →
 *   `bulkBuild(rows, { include, includeNames, includeMap, includeValidated: true, raw: true })`).
 *
 *   Each descriptor mirrors what `_conformIncludes` produces for the hydration step:
 *   `{ as, association, model: association.target, include, includeNames, includeMap }`.
 *   `Model#_setInclude` (invoked by `set()` during construction) then rebuilds each
 *   included association's rows via `include.model.bulkBuild(row, childOptions)`, so
 *   `instance[alias]`, `instance.dataValues[alias]` and `instance.get(alias)` all resolve
 *   exactly as on a live hydrated instance, recursively for nested includes.
 *
 *   Returns `null` when `sample` carries no key registered as an association on `klass`
 *   (plain model without included associations), so reconstruction keeps the legacy
 *   scalar-only behaviour.
 */
function buildIncludeTree(
  klass: object,
  sample: unknown,
): {
  include: unknown[];
  includeNames: string[];
  includeMap: Record<string, unknown>;
} | null {
  const associations = (klass as { associations?: Record<string, unknown> }).associations;
  if (!associations || !sample || typeof sample !== 'object') return null;
  const row = Array.isArray(sample)
    ? sample.find(
        (r): r is Record<string, unknown> =>
          r !== null && typeof r === 'object' && !Array.isArray(r),
      )
    : (sample as Record<string, unknown>);
  if (!row || typeof row !== 'object') return null;

  const include: unknown[] = [];
  const includeNames: string[] = [];
  const includeMap: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const association = (associations as Record<string, any>)[key];
    if (!association || typeof association.target !== 'function') continue;
    const nested = buildIncludeTree(association.target, row[key]);
    const descriptor = {
      as: key,
      association,
      model: association.target,
      include: nested?.include ?? [],
      includeNames: nested?.includeNames ?? [],
      includeMap: nested?.includeMap ?? {},
    };
    include.push(descriptor);
    includeNames.push(key);
    includeMap[key] = descriptor;
  }
  return include.length > 0 ? { include, includeNames, includeMap } : null;
}

/**
 * @description Marks every model instance produced during a replay reconstruction
 *   (the top-level one and all nested included-association rows) as eligible for the
 *   replay-miss fallback. Sequelize column accessors delegate to the wrapped `get`, and
 *   association rows rebuilt via `_setInclude` are never registered under refIds, so
 *   without this their unrecorded attribute reads (e.g. `role.role_id`) would throw
 *   `UnimockReplayMissError` instead of reading their own hydrated state.
 */
function markRebuiltDeep(value: unknown): void {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const el of value) markRebuiltDeep(el);
    return;
  }
  const dataValues = (value as { dataValues?: unknown }).dataValues;
  if (dataValues === undefined || typeof dataValues !== 'object') return;
  replayRebuilt.add(value);
  for (const el of Object.values(dataValues as Record<string, unknown>))
    markRebuiltDeep(el);
}

/**
 * @description Rebuilds a model instance from plain (deserialised) data using the ORIGINAL
 *   static `build` captured before wrapping: `build.call(klass, plain, { isNewRecord: false })`.
 *   The wrapped `build` is deliberately not used — in replay mode it would route into a
 *   replay lookup for reconstruction args that were never recorded and throw
 *   `UnimockReplayMissError`.
 *
 *   The call is made with the reconstruction-depth guard raised so that constructor-internal
 *   wrapped prototype calls (e.g. Sequelize `_initValues`) pass through to their originals
 *   instead of doing replay lookups with reconstruction options record mode never produced.
 *
 *   Before synthesising the include tree, {@link ensureAssociated} repopulates the model's
 *   `associations` map when the replay boot re-initialised it (plain `Model#init` resets it to
 *   `{}`), so alias detection and Sequelize's own `_setInclude` rehydration behave as in record
 *   mode.
 *
 *   When `plain` carries included associations (keys matching the model's registered
 *   association aliases — e.g. `roles` on a `findOne({ include })` result), the call is
 *   made with the hydration options synthesised by {@link buildIncludeTree}
 *   (`include` / `includeNames` / `includeMap` / `includeValidated: true` / `raw: true`) so
 *   the constructor's `set()` routes those keys through Sequelize's own `_setInclude`
 *   rehydration — the same path a live query result takes. Scalar-only records keep the
 *   legacy `{ isNewRecord: false }` call augmented with `raw: true`.
 *
 *   `raw: true` is REQUIRED for hydration parity: a live `findOne`/`findAll` hydrates rows
 *   via `bulkBuild(rows, { isNewRecord: false, raw: true, ... })` (see Sequelize
 *   `Query.prototype.handleSelectQuery`), whose `raw` flag makes `set()` keep EVERY row key
 *   in `dataValues` — including non-attribute keys such as aggregate aliases
 *   (`attributes: [[fn('MAX', col('order_number')), 'number']]` → `dataValues.number`).
 *   Without `raw: true` the attribute-gated `set()` silently drops those keys, so a rebuilt
 *   aggregate `findOne` result came back with an EMPTY `dataValues` (`number.dataValues.number`
 *   → undefined at replay while record mode returned the real value).
 *
 *   Returns `plain` as-is when `build` is unavailable or `plain` is not a non-empty
 *   plain object (null, array, class instance, empty object).
 */
function rebuildInstance(
  klass: new (...args: unknown[]) => object,
  plain: unknown,
): unknown {
  const build = staticOriginals.get(klass)?.get('build') ?? (klass as unknown as Record<string, unknown>).build;
  const isPlainObject =
    plain !== null &&
    typeof plain === 'object' &&
    !Array.isArray(plain) &&
    Object.getPrototypeOf(plain) === Object.prototype &&
    Object.keys(plain).length > 0;
  if (typeof build === 'function' && isPlainObject) {
    return withReconstructionDepth(() => {
      ensureAssociated(klass);
      const includeTree = buildIncludeTree(klass, plain);
      const options = includeTree
        ? {
            isNewRecord: false,
            include: includeTree.include,
            includeNames: includeTree.includeNames,
            includeMap: includeTree.includeMap,
            includeValidated: true,
            raw: true,
          }
        : { isNewRecord: false, raw: true };
      const instance = (build as (...a: unknown[]) => unknown).call(klass, plain, options);
      if (instance !== null && typeof instance === 'object') markRebuiltDeep(instance);
      return instance;
    });
  }
  return plain;
}

/**
 * @description Assigns a per-instance refId to every model element of a LIVE static
 *   result, mirroring {@link wrapResult}'s assignment (the shared refId cache + getOrAssignRefId) —
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
 *   Returns `null` for a KNOWN non-chain shape whose result contains NO model element —
 *   e.g. a `raw: true` query, whose rows are plain objects at record time and must stay
 *   plain objects at replay (instance reconstruction is skipped for such entries).
 *   Returns `null` when the shape is unknown or `chain`-like (the v2 format always records an
 *   explicit `refs` field; replay keys on that field, not on its absence).
 */
export function assignStaticRefs(name: string, result: unknown): unknown {
  const shape = STATIC_REPLAY_SHAPE[name];
  if (!shape || shape === 'chain') return undefined;

  const assign = (el: unknown): string | undefined => {
    if (!el || typeof el !== 'object') return undefined;
    const existing = getUnimockRef(el);
    if (existing !== undefined) return existing;
    if (!hasMethods(el)) return undefined;
    return getOrAssignRefId(el);
  };

  const noneAssigned = (assigned: (string | undefined)[]): boolean =>
    assigned.every((r) => r === undefined);

  switch (shape) {
    case 'single':
      return assign(result) ?? null;
    case 'array': {
      if (!Array.isArray(result)) return null;
      const refs = result.map(assign);
      return noneAssigned(refs) ? null : refs;
    }
    case 'pairInstance': {
      if (!Array.isArray(result)) return null;
      const ref = assign(result[0]);
      return ref !== undefined ? [ref, undefined] : null;
    }
    case 'pairCount': {
      if (!Array.isArray(result) || !Array.isArray(result[1])) return null;
      const rows = (result[1] as unknown[]).map(assign);
      return noneAssigned(rows) ? null : [undefined, rows];
    }
    case 'wrapper': {
      const rows = (result as { rows?: unknown } | null)?.rows;
      if (!Array.isArray(rows)) return null;
      const refs = rows.map(assign);
      return noneAssigned(refs) ? null : { rows: refs };
    }
    default:
      return undefined;
  }
}

/**
 * @description Records a static method call result (without ConnectionHandler wrapping).
 *   Assigns per-instance refIds to model elements first (see {@link assignStaticRefs} —
 *   a known-shape result with no model element records `refs: null`, the raw/plain marker),
 *   then converts via {@link toPlain} (a `.toJSON()` call produces the plain value).
 *   STILL RETURNS THE RAW LIVE RESULT — callers receive real instances in record mode.
 */
export function recordStaticResult(
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
    // v2 format: explicit field on every static call entry (null when no instance markup).
    refs: refs ?? null,
  };
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
export function toPlain(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Error ||
    Buffer.isBuffer(value)
  ) {
    return value;
  }
  if (typeof (value as Record<string, unknown>).toJSON === 'function')
    return (value as { toJSON(): unknown }).toJSON();
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