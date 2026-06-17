import { createHash } from 'node:crypto';
import type { SerializedValue } from './interfaces';
import {
  T_UNDEFINED,
  T_NULL,
  T_BOOLEAN,
  T_NUMBER,
  T_STRING,
  T_BIGINT,
  T_DATE,
  T_REGEXP,
  T_BUFFER,
  T_ERROR,
  T_REF,
  T_ARRAY,
  T_OBJECT,
  PROP_PRIVATE_PREFIX,
  MARKER_CALLBACK,
  MARKER_FUNCTION,
  MARKER_SYMBOL,
  HASH_ALGORITHM,
  HASH_ENCODING,
  ENCODING_BASE64,
  STABLE_HASH_LENGTH,
} from './constants';
import { stripRequestEnabled } from './env';

/**
 * @description Deterministic JSON-like stringification of arbitrary values.
 *   - Object keys are sorted alphabetically.
 *   - Functions and symbols are replaced with constant markers.
 *   - Circular references produce an empty string for the repeated path.
 *   Used internally by {@link stableHash} to produce consistent call keys.
 *
 * @param value - value to stringify
 * @param seen - set of already-visited objects (circular reference guard)
 */
export function stableStringify(value: unknown, seen?: Set<object>): string {
  if (value === null) return 'null';
  if (value === undefined) return '';
  if (typeof value === 'boolean' || typeof value === 'number')
    return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'bigint') return JSON.stringify(value.toString());
  if (typeof value === 'function') return MARKER_FUNCTION;
  if (typeof value === 'symbol') return MARKER_SYMBOL;
  if (typeof value === 'object' && value !== null) {
    const s = seen ?? new Set<object>();
    if (s.has(value)) return '';
    s.add(value);
    if (Array.isArray(value))
      return `[${value.map((v) => stableStringify(v, s)).join(',')}]`;
    const keys = Object.keys(value as Record<string, unknown>).sort();
    return `{${keys
      .map(
        (k) =>
          `${JSON.stringify(k)}:${stableStringify(
            (value as Record<string, unknown>)[k],
            s,
          )}`,
      )
      .join(',')}}`;
  }
  return JSON.stringify(String(value));
}

/**
 * @description Computes a short, deterministic hash of a value using {@link stableStringify} + MD5.
 *   The hash length is controlled by {@link STABLE_HASH_LENGTH} (default 8 hex chars).
 *
 * @param value - value to hash
 */
export function stableHash(value: unknown): string {
  return createHash(HASH_ALGORITHM)
    .update(stableStringify(value))
    .digest(HASH_ENCODING)
    .slice(0, STABLE_HASH_LENGTH);
}

/**
 * @description Builds a deterministic call key used for snapshot lookup.
 *   Format: `prefix + method + ':' + stableHash(args)`.
 *   Functions in args are replaced with {@link MARKER_CALLBACK} before hashing.
 *
 * @param prefix - key prefix (empty for direct methods, `conn:{refId}:` for connection calls)
 * @param method - method name
 * @param args - raw call arguments
 */
export function makeCallKey(prefix: string, method: string, args: unknown[]): string {
  const safeArgs = args.map((a) => (typeof a === 'function' ? MARKER_CALLBACK : a));
  const h = safeArgs.length > 0 ? stableHash(safeArgs) : '';
  return `${prefix}${method}:${h}`;
}

/**
 * @description Serialises an arbitrary JavaScript value into the uniform {@link SerializedValue} format.
 *   Handles primitives, Date, RegExp, Buffer, Error, arrays, and plain objects.
 *   Objects with prototype !== Object.prototype are treated as opaque and returned as `{t: 'ref'}`.
 *   When {@link stripRequestEnabled} is set, the `request` key is skipped (Axios HTTP internals).
 *
 * @param value - value to serialise
 * @param seen - cyclic reference guard (Map of object → placeholder)
 */
export function serialize(value: unknown, seen?: Map<object, string>): SerializedValue {
  if (value === undefined) return { t: T_UNDEFINED };
  if (value === null) return { t: T_NULL };
  if (typeof value === 'boolean') return { t: T_BOOLEAN, v: value };
  if (typeof value === 'number') return { t: T_NUMBER, v: value };
  if (typeof value === 'string') return { t: T_STRING, v: value };
  if (typeof value === 'bigint') return { t: T_BIGINT, v: value.toString() };
  if (typeof value === 'function') return { t: T_STRING, v: MARKER_CALLBACK };
  if (value instanceof Date) return { t: T_DATE, v: value.toISOString() };
  if (value instanceof RegExp)
    return { t: T_REGEXP, v: { s: value.source, f: value.flags } };
  if (Buffer.isBuffer(value)) return { t: T_BUFFER, v: value.toString(ENCODING_BASE64) };
  if (value instanceof Error)
    return { t: T_ERROR, v: { n: value.name, m: value.message, s: value.stack } };
  if (Array.isArray(value)) {
    const map = seen ?? new Map<object, string>();
    if (map.has(value)) return { t: T_UNDEFINED };
    map.set(value, '');
    const mapped: SerializedValue[] = [];
    for (const item of value) mapped.push(serialize(item, map));
    return { t: T_ARRAY, v: mapped };
  }
  if (typeof value === 'object' && value !== null) {
    const map = seen ?? new Map<object, string>();
    if (map.has(value)) return { t: T_UNDEFINED };
    map.set(value, '');
    const entries = Object.entries(value as Record<string, unknown>);
    const mapped: { k: string; v: SerializedValue }[] = [];
    for (const [k, v] of entries) {
      if (k.startsWith(PROP_PRIVATE_PREFIX)) continue;
      if (stripRequestEnabled() && k === 'request') continue;
      mapped.push({ k, v: serialize(v, map) });
    }
    return { t: T_OBJECT, v: mapped };
  }
  return { t: T_STRING, v: String(value) };
}

/**
 * @description Reverses {@link serialize}, converting a {@link SerializedValue} back to its
 *   original JavaScript type.
 *   - `'ref'` entries are returned as the raw refId string (further resolution is done by
 *     the caller via {@link ConnectionHandler}).
 *   - `'pooled_string'` entries are NOT handled here — they are expanded transparently
 *     by {@link SnapshotStore.get} before reaching this function.
 *
 * @param value - serialised value to restore
 */
export function deserialize(value: SerializedValue): unknown {
  switch (value.t) {
    case T_UNDEFINED:
      return undefined;
    case T_NULL:
      return null;
    case T_BOOLEAN:
    case T_NUMBER:
    case T_STRING:
      return value.v;
    case T_BIGINT:
      return BigInt(value.v as string);
    case T_DATE:
      return new Date(value.v);
    case T_REGEXP:
      return new RegExp(value.v.s, value.v.f);
    case T_BUFFER:
      return Buffer.from(value.v, ENCODING_BASE64);
    case T_ERROR:
      return Object.assign(new Error(value.v.m), { name: value.v.n, stack: value.v.s });
    case T_REF:
      return value.v;
    case T_ARRAY:
      return value.v.map((v) => deserialize(v));
    case T_OBJECT:
      return value.v.reduce((acc, { k, v }) => {
        acc[k] = deserialize(v);
        return acc;
      }, {} as Record<string, unknown>);
    default:
      return undefined;
  }
}
