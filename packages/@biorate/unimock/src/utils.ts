import { PREFIX_OBJ, PROP_PRIVATE_PREFIX } from './constants';

let counter = 0;

export function nextRefId(prefix = PREFIX_OBJ): string {
  return `${prefix}${counter++}`;
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

export interface DescriptorEntry {
  key: string;
  descriptor: PropertyDescriptor;
}

export interface CollectOptions {
  skipKeys?: ReadonlySet<string>;
  skipPrefix?: string;
  filter?: (key: string, descriptor: PropertyDescriptor) => boolean;
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
