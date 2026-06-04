import { ISerializer } from './interfaces';
import { UnimockSerializeError } from './errors';

export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null) return value;
  if (typeof value === 'bigint') return { __type: 'bigint', value: `${value}` };
  if (typeof value !== 'object') return value;
  if (seen.has(value)) return { __type: 'Circular' };
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sortValue(item, seen));
  if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
    return { __type: 'Buffer', value: value.toString('base64') };
  }
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value as object).sort()) {
    sorted[key] = sortValue((value as Record<string, unknown>)[key], seen);
  }
  return sorted;
}

export function stableHash(value: unknown): string {
  const text = stableStringify(value);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function makeCallKey(nodeId: string, method: string, args: unknown[]): string {
  return `${nodeId}|${method}|${stableHash(args)}`;
}

export function serializeValue(value: unknown, serializers: ISerializer[]): unknown {
  if (value === undefined) return { __type: 'undefined' };
  if (value === null) return null;
  for (const serializer of serializers) {
    if (serializer.test(value)) return serializer.pack(value);
  }
  try {
    return JSON.parse(stableStringify(value));
  } catch (e: unknown) {
    throw new UnimockSerializeError(e instanceof Error ? e.message : 'unknown', {
      valueType: typeof value,
    });
  }
}

export function deserializeValue(value: unknown, serializers: ISerializer[]): unknown {
  if (value && typeof value === 'object' && '__type' in value) {
    const typed = value as { __type: string; value?: string };
    switch (typed.__type) {
      case 'undefined':
        return undefined;
      case 'Date':
        return new Date(typed.value ?? '');
      case 'Buffer':
        return Buffer.from(typed.value ?? '', 'base64');
      case 'bigint':
        return BigInt(typed.value ?? '0');
      default:
        break;
    }
  }
  if (value && typeof value === 'object' && '__unimockPack' in value) {
    for (const serializer of serializers) {
      if (serializer.test(value)) return serializer.unpack(value);
    }
  }
  for (const serializer of serializers) {
    if (serializer.test(value)) return serializer.unpack(value);
  }
  return value;
}

export function isObjectLike(value: unknown): value is object {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
}
