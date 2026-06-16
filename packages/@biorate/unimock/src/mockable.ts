import type { MockableOptions, SerializedValue, UnimockMode } from './interfaces';
import type { SnapshotStore } from './snapshot-store';
import { getSnapshotStore, SnapshotStore as SnapshotStoreClass } from './snapshot-store';
import { makeCallKey, serialize, deserialize } from './serializer';
import { UnimockReplayMissError } from './errors';
import { ConnectionHandler } from './connection-proxy';

let counter = 0;

export function Mockable(options?: MockableOptions) {
  return function <T extends new (...args: any[]) => object>(Base: T): T {
    const className = Base.name;
    const store = getSnapshotStore(className, options?.snapshotDir);

    patchPrototype(Base.prototype, store);

    if (options?.wrapStatics) {
      wrapStaticMethods(Base, store);
    }

    return Base;
  };
}

function patchPrototype(proto: object, store: SnapshotStore): void {
  const visited = new Set<string>();
  const entries: Array<{ key: string; descriptor: PropertyDescriptor }> = [];

  let current = proto;
  while (current && current !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(current)) {
      if (key === 'constructor' || key.startsWith('#') || visited.has(key)) continue;
      visited.add(key);
      const descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (descriptor) entries.push({ key, descriptor });
    }
    current = Object.getPrototypeOf(current);
  }

  entries.reverse();

  for (const { key, descriptor } of entries) {
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(proto, key, {
        value: wrapMethod(key, descriptor.value as (...args: unknown[]) => unknown, store),
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
): (...args: unknown[]) => unknown {
  return function (this: unknown, ...args: unknown[]) {
    const mode = store.mode;
    const reportArgs = args.map((a) => (typeof a === 'function' ? '<callback>' : a));
    const callKey = makeCallKey('', name, reportArgs);

    if (mode === 'replay') return replayCall(callKey, name, args, store);

    const { recordedArgs, callbackRecords } = recordPrep(args);

    try {
      const result = original.apply(this, recordedArgs);

      if (result instanceof Promise) {
        return result.then(
          (resolved: unknown) => {
            const sa = serializeArgs(recordedArgs, callbackRecords);
            return recordResult(store, callKey, resolved, sa);
          },
          (error: Error) => {
            const sa = serializeArgs(recordedArgs, callbackRecords);
            store.record(callKey, {
              args: sa,
              result: { t: 'undefined' },
              error: serialize(error),
            });
            throw error;
          },
        );
      }

      const sa = serializeArgs(recordedArgs, callbackRecords);
      return recordResult(store, callKey, result, sa);
    } catch (e: unknown) {
      const sa = serializeArgs(recordedArgs, callbackRecords);
      store.record(callKey, {
        args: sa,
        result: { t: 'undefined' },
        error: serialize(e as Error),
      });
      throw e;
    }
  };
}

function wrapMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(name, original, store, wrapAndRecord);
}

function wrapStaticMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
): (...args: unknown[]) => unknown {
  return makeMethodWrapper(name, original, store, recordStaticResult);
}

function replayCall(
  callKey: string,
  name: string,
  args: unknown[],
  store: SnapshotStore,
): unknown {
  const entry = store.get(callKey);
  if (!entry) throw new UnimockReplayMissError(callKey, name, args);

  if (entry.error) throw deserialize(entry.error) as Error;

  const promises = replayCallbacks(entry.args, args);

  if (entry.result.t === 'ref') {
    const conn = new ConnectionHandler(null, entry.result.v, store);
    if (promises.length > 0) return Promise.all(promises).then(() => conn);
    return conn;
  }

  const result = deserialize(entry.result);
  if (promises.length > 0) return Promise.all(promises).then(() => result);
  return result;
}

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
    if (typeof arg === 'function') {
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

function serializeArgs(
  recordedArgs: unknown[],
  callbacks: Array<{
    index: number;
    records: unknown[][];
    fn: (...a: unknown[]) => unknown;
  }>,
): SerializedValue[] {
  return recordedArgs.map((a, i) => {
    if (typeof a === 'function') {
      const cb = callbacks.find((c) => c.index === i);
      if (cb) {
        return {
          t: 'callback' as const,
          v: {
            callRef: `cb_${counter++}`,
            recording: cb.records.map((rec) => rec.map((arg) => serialize(arg))),
          },
        };
      }
    }
    return serialize(a);
  });
}

function wrapAndRecord(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
): unknown {
  if (hasMethods(result)) {
    const refId = `obj_${counter++}`;
    const wrapped = new ConnectionHandler(result, refId, store);
    store.record(callKey, {
      args: serializedArgs,
      result: { t: 'ref', v: refId },
      error: undefined,
    });
    return wrapped;
  }
  store.record(callKey, {
    args: serializedArgs,
    result: serialize(result),
    error: undefined,
  });
  return result;
}

function hasMethods(value: unknown): value is object {
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

const STATIC_SAFE = new Set([
  'sync',
  'drop',
  'create',
  'findOne',
  'findAll',
  'findByPk',
  'findOrCreate',
  'findOrBuild',
  'findCreateFind',
  'findAndCountAll',
  'destroy',
  'update',
  'upsert',
  'bulkCreate',
  'truncate',
  'restore',
  'count',
  'sum',
  'min',
  'max',
  'increment',
  'decrement',
  'describe',
  'scope',
  'unscoped',
  'schema',
  'getTableName',
  'addScope',
  'removeAttribute',
  'getAttributes',
  'hasAlias',
  'hasMany',
  'belongsToMany',
  'hasOne',
  'belongsTo',
  'build',
  'bulkBuild',
  'warnOnInvalidOptions',
]);

function wrapStaticMethods(
  klass: new (...args: unknown[]) => object,
  store: SnapshotStore,
): void {
  const visited = new Set<string>();
  let ctor = Object.getPrototypeOf(klass);
  while (ctor && ctor !== Function.prototype) {
    for (const key of Object.getOwnPropertyNames(ctor)) {
      if (key === 'constructor' || key === 'prototype' || key === 'name' || key === 'length' || visited.has(key)) continue;
      visited.add(key);
      if (!STATIC_SAFE.has(key)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(ctor, key);
      if (descriptor && typeof descriptor.value === 'function') {
        Object.defineProperty(klass, key, {
          value: wrapStaticMethod(key, descriptor.value, store),
          writable: true,
          configurable: true,
        });
      }
    }
    ctor = Object.getPrototypeOf(ctor);
  }
}

function recordStaticResult(
  store: SnapshotStore,
  callKey: string,
  result: unknown,
  serializedArgs: SerializedValue[],
): unknown {
  const data = toPlain(result);
  store.record(callKey, { args: serializedArgs, result: serialize(data), error: undefined });
  return result;
}

function toPlain(value: unknown): unknown {
  if (value && typeof value === 'object' && typeof (value as any).toJSON === 'function') {
    return (value as any).toJSON();
  }
  return value;
}

function wrapGetter(
  name: string,
  original: () => unknown,
  store: SnapshotStore,
): () => unknown {
  return function (this: unknown) {
    const callKey = makeCallKey('', name, []);
    const mode = store.mode;

    if (mode === 'replay') {
      const entry = store.get(callKey);
      if (!entry) throw new UnimockReplayMissError(callKey, name, []);
      if (entry.result.t === 'ref')
        return new ConnectionHandler(null, entry.result.v, store);
      return deserialize(entry.result);
    }

    const result = original.call(this);
    if (hasMethods(result)) {
      const refId = `obj_${counter++}`;
      const wrapped = new ConnectionHandler(result, refId, store);
      store.record(callKey, { args: [], result: { t: 'ref', v: refId } });
      return wrapped;
    }
    store.record(callKey, { args: [], result: serialize(result) });
    return result;
  };
}
