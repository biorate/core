import { PREFIX_REF, T_UNDEFINED, PROP_UNIMOCK_REF } from './constants';
import { serialize, deserialize } from './serializer';
import { UnimockReplayMissError } from './errors';
import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue, SnapshotCall } from './interfaces';

/**
 * @description Deterministic ref-id allocation.
 *
 * Model-instance ref ids are `ref_<ClassName>_<n>` where `n` is a per-class
 * ordinal. Keying the counter by class name (instead of one global counter)
 * makes the ref id a pure function of (class, ordinal within class), so
 * cross-class object-creation-order differences between a record run and a
 * replay run (live connector vs mocked connector, replay-boot) can no longer
 * shift ref ids — the root cause of replay-miss cascades.
 *
 * Ref ids without a class (e.g. `cb_` callback labels) fall back to a
 * per-prefix ordinal; they are cosmetic and never used for call-key matching.
 */
const refCounters = new Map<string, number>();

function nextOrdinal(key: string): number {
  const n = (refCounters.get(key) ?? 0) + 1;
  refCounters.set(key, n);
  return n;
}

export function nextRefId(prefix: string, className?: string): string {
  if (className) {
    return `${prefix}${className}_${nextOrdinal(`${prefix}#${className}`)}`;
  }
  return `${prefix}${nextOrdinal(`${prefix}#misc`)}`;
}

/** Reset all per-class ref ordinals so a record run re-assigns ref ids from 1 (no cross-run carry-over). */
export function resetRefCounters(): void {
  refCounters.clear();
}

/**
 * @description Stable class name used as the ref-id class key. Named classes
 *   (e.g. Sequelize models) report their own name; plain objects fall back to
 *   `Object`.
 */
export function refClassName(value: unknown): string {
  const name = (value as { constructor?: { name?: string } } | null | undefined)
    ?.constructor?.name;
  return name ? name : 'Object';
}

export function hasMethods(value: unknown): value is object {
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

export function getReplayEntry(
  store: SnapshotStore,
  callKey: string,
  name: string,
  args: unknown[],
): SnapshotCall {
  const entry = store.get(callKey);
  if (!entry) throw new UnimockReplayMissError(callKey, name, args);
  if (entry.error) throw deserialize(entry.error) as Error;
  return entry;
}

export function getReplayStaticEntry(
  store: SnapshotStore,
  callKey: string,
  name: string,
  args: unknown[],
): SnapshotCall {
  const entry = store.nextStaticReplayEntry(callKey);
  if (!entry) throw new UnimockReplayMissError(callKey, name, args);
  if (entry.error) throw deserialize(entry.error) as Error;
  return entry;
}

export function recordError(
  store: SnapshotStore,
  callKey: string,
  serializedArgs: SerializedValue[],
  error: unknown,
): never {
  store.record(callKey, {
    args: serializedArgs,
    result: { t: T_UNDEFINED },
    error: serialize(error, undefined, store.symbols),
  });
  throw error;
}

export interface DescriptorEntry {
  key: string;
  descriptor: PropertyDescriptor;
}

export interface CollectOptions {
  skipKeys?: ReadonlySet<string>;
  skipPrefix?: string;
  filter?: (key: string, descriptor: PropertyDescriptor) => boolean;
}

/** @description Per-instance ref-id cache, shared across the wrapper factory and MockHandler. */
const refIdCache = new WeakMap<object, string>();

/**
 * @description Returns the cached refId for an object (`undefined` when none assigned).
 *   Used to keep call keys stable across repeated accesses to the same object.
 */
export function getRefId(value: object): string | undefined {
  return refIdCache.get(value);
}

/**
 * @description Assigns (and caches) a per-instance refId for an object, returning the
 *   existing id when already assigned. Called by wrapResult / wrapNested / assignStaticRefs
 *   so repeated `get()`s on the same connection reuse the same refId.
 */
export function getOrAssignRefId(value: object): string {
  const existing = refIdCache.get(value);
  if (existing) return existing;
  const refId = nextRefId(PREFIX_REF, refClassName(value));
  refIdCache.set(value, refId);
  return refId;
}

/** @description Binds a recorded refId onto a rebuilt instance (replay only — never allocates). */
export function setRefId(value: object, refId: string): void {
  refIdCache.set(value, refId);
}

/**
 * @description Reads the `__unimock_ref__` marker off an already-wrapped object, or
 *   `undefined` when it is not a MockHandler-wrapped value.
 */
export function getUnimockRef(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = (value as Record<string, unknown>)[PROP_UNIMOCK_REF];
  return typeof v === 'string' ? v : undefined;
}

/**
 * @description Duck-typed Promise check: any object exposing a callable `then` (native
 *   Promises, Bluebird, `Promise.resolve`-like userland promises). Avoids the expensive
 *   `instanceof Promise` that misses cross-realm/augmented promise implementations.
 */
export function isPromiseLike(value: unknown): value is { then: (...a: unknown[]) => unknown } {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

export function collectOwnDescriptors(
  start: object,
  stopAt: object,
  options?: CollectOptions,
): DescriptorEntry[] {
  const visited = new Set<string>();
  const entries: DescriptorEntry[] = [];
  let current = start;
  while (current && current !== stopAt) {
    for (const key of Object.getOwnPropertyNames(current)) {
      if (visited.has(key)) continue;
      visited.add(key);
      if (options?.skipKeys?.has(key)) continue;
      if (options?.skipPrefix && key.startsWith(options.skipPrefix)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (!descriptor) continue;
      if (options?.filter && !options.filter(key, descriptor)) continue;
      entries.push({ key, descriptor });
    }
    current = Object.getPrototypeOf(current);
  }
  return entries.reverse();
}
