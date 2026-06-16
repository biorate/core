import { createHash } from 'node:crypto';
import type { SerializedValue } from './interfaces';

export function stableStringify(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return '';
  if (typeof value === 'boolean' || typeof value === 'number') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'bigint') return JSON.stringify(value.toString());
  if (typeof value === 'function') return '<function>';
  if (typeof value === 'symbol') return '<symbol>';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
  }
  return JSON.stringify(String(value));
}

export function stableHash(value: unknown): string {
  return createHash('md5').update(stableStringify(value)).digest('hex').slice(0, 8);
}

export function makeCallKey(prefix: string, method: string, args: unknown[]): string {
  const safeArgs = args.map((a) => (typeof a === 'function' ? '<callback>' : a));
  const h = safeArgs.length > 0 ? stableHash(safeArgs) : '';
  return `${prefix}${method}:${h}`;
}

export function serialize(value: unknown, seen?: Map<object, string>): SerializedValue {
  if (value === undefined) return { t: 'undefined' };
  if (value === null) return { t: 'null' };
  if (typeof value === 'boolean') return { t: 'boolean', v: value };
  if (typeof value === 'number') return { t: 'number', v: value };
  if (typeof value === 'string') return { t: 'string', v: value };
  if (typeof value === 'bigint') return { t: 'bigint', v: value.toString() };
  if (typeof value === 'function') return { t: 'string', v: '<callback>' };
  if (value instanceof Date) return { t: 'date', v: value.toISOString() };
  if (value instanceof RegExp) return { t: 'regexp', v: { s: value.source, f: value.flags } };
  if (Buffer.isBuffer(value)) return { t: 'buffer', v: value.toString('base64') };
  if (value instanceof Error) return { t: 'error', v: { n: value.name, m: value.message, s: value.stack } };
  if (Array.isArray(value)) {
    const mapped: SerializedValue[] = [];
    const map = seen ?? new Map<object, string>();
    if (map.has(value)) return { t: 'ref', v: map.get(value)! };
    for (const item of value) mapped.push(serialize(item, map));
    return { t: 'array', v: mapped };
  }
  if (typeof value === 'object' && value !== null) {
    const map = seen ?? new Map<object, string>();
    const entries = Object.entries(value as Record<string, unknown>);
    const mapped: { k: string; v: SerializedValue }[] = [];
    for (const [k, v] of entries) {
      if (k.startsWith('#')) continue;
      mapped.push({ k, v: serialize(v, map) });
    }
    return { t: 'object', v: mapped };
  }
  return { t: 'string', v: String(value) };
}

export function deserialize(value: SerializedValue): unknown {
  switch (value.t) {
    case 'undefined':
      return undefined;
    case 'null':
      return null;
    case 'boolean':
    case 'number':
    case 'string':
      return value.v;
    case 'bigint':
      return BigInt(value.v as string);
    case 'date':
      return new Date(value.v);
    case 'regexp':
      return new RegExp(value.v.s, value.v.f);
    case 'buffer':
      return Buffer.from(value.v, 'base64');
    case 'error':
      return Object.assign(new Error(value.v.m), { name: value.v.n, stack: value.v.s });
    case 'ref':
      return value.v;
    case 'array':
      return value.v.map((v) => deserialize(v));
    case 'object':
      return value.v.reduce(
        (acc, { k, v }) => {
          acc[k] = deserialize(v);
          return acc;
        },
        {} as Record<string, unknown>,
      );
    default:
      return undefined;
  }
}
