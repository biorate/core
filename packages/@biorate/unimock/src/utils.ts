import { PREFIX_OBJ, T_UNDEFINED } from './constants';
import { serialize, deserialize } from './serializer';
import { UnimockReplayMissError } from './errors';
import type { SnapshotStore } from './snapshot-store';
import type { SerializedValue, SnapshotCall } from './interfaces';

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

export function recordError(
  store: SnapshotStore,
  callKey: string,
  serializedArgs: SerializedValue[],
  error: unknown,
): never {
  store.record(callKey, {
    args: serializedArgs,
    result: { t: T_UNDEFINED },
    error: serialize(error),
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
