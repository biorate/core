import type { ISerializer } from '../types';
import { UnimockSerializeError } from '../errors';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export const opaqueHandleSerializer: ISerializer = {
  name: 'opaque-handle',
  test(value: unknown) {
    if (!value || typeof value !== 'object') return false;
    if (value instanceof Date) return false;
    if (value instanceof Error) return false;
    if (Array.isArray(value)) return false;
    return !isPlainObject(value);
  },
  serialize(value: unknown) {
    const ctor =
      value && typeof value === 'object'
        ? (value as { constructor?: { name?: string } }).constructor?.name
        : undefined;
    return { $opaque: true, type: ctor ?? typeof value };
  },
};

export const errorSerializer: ISerializer = {
  name: 'error',
  test(value: unknown) {
    return value instanceof Error;
  },
  serialize(value: unknown) {
    const e = value as Error;
    return {
      $error: true,
      name: e.name,
      message: e.message,
      stack: e.stack,
    };
  },
};

export const bigintSerializer: ISerializer = {
  name: 'bigint',
  test(value: unknown) {
    return typeof value === 'bigint';
  },
  serialize(value: unknown) {
    return { $bigint: true, value: String(value) };
  },
};

export const functionSerializer: ISerializer = {
  name: 'function',
  test(value: unknown) {
    return typeof value === 'function';
  },
  serialize(value: unknown) {
    const fn = value as Function;
    return { $function: true, name: fn.name || '(anonymous)' };
  },
};

export const symbolSerializer: ISerializer = {
  name: 'symbol',
  test(value: unknown) {
    return typeof value === 'symbol';
  },
  serialize(value: unknown) {
    const s = value as symbol;
    return { $symbol: true, description: s.description };
  },
};

export const defaultSerializers: readonly ISerializer[] = [
  errorSerializer,
  bigintSerializer,
  symbolSerializer,
  functionSerializer,
  opaqueHandleSerializer,
] as const;

export function serializeWith(
  value: unknown,
  serializers: readonly ISerializer[],
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (value === null) return null;
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value;

  for (const serializer of serializers) {
    if (!serializer.test(value)) continue;
    try {
      return serializer.serialize(value);
    } catch (e: unknown) {
      throw new UnimockSerializeError(
        serializer.name,
        e instanceof Error ? e : new Error(String(e)),
      );
    }
  }

  if (value instanceof Date) return { $date: true, value: value.toISOString() };

  if (Array.isArray(value)) {
    return value.map((v) => serializeWith(v, serializers, seen));
  }

  if (typeof value === 'object') {
    if (seen.has(value)) return { $ref: true };
    seen.add(value);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serializeWith(v, serializers, seen);
    }
    return out;
  }

  return { $unknown: true, type: typeof value };
}

