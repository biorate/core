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

    class MockedClass extends Base {
      constructor(...args: any[]) {
        super(...args);

        const mode = SnapshotStoreClass.mode;
        if (mode === 'off') return;

        const store = getSnapshotStore(className, options?.snapshotDir);

        wrapPrototype(this as unknown as Record<string, unknown>, store);
      }
    }

    Object.defineProperty(MockedClass, 'name', {
      value: className,
      configurable: true,
    });

    return MockedClass as unknown as T;
  };
}

function wrapPrototype(instance: Record<string, unknown>, store: SnapshotStore): void {
  const visited = new Set<string>();
  const entries: Array<{ key: string; descriptor: PropertyDescriptor }> = [];

  let proto = Object.getPrototypeOf(instance);
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor' || key.startsWith('#') || visited.has(key)) continue;
      visited.add(key);
      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      if (descriptor) entries.push({ key, descriptor });
    }
    proto = Object.getPrototypeOf(proto);
  }

  entries.reverse();

  for (const { key, descriptor } of entries) {
    if (typeof descriptor.value === 'function') {
      instance[key] = wrapMethod(key, descriptor.value.bind(instance), store);
    }
    if (descriptor.get) {
      Object.defineProperty(instance, key, {
        get: wrapGetter(key, descriptor.get.bind(instance), store),
        set: descriptor.set ? descriptor.set.bind(instance) : undefined,
        configurable: true,
      });
    }
  }
}

function wrapMethod(
  name: string,
  original: (...args: unknown[]) => unknown,
  store: SnapshotStore,
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
            return wrapAndRecord(store, callKey, resolved, sa);
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
      return wrapAndRecord(store, callKey, result, sa);
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

function wrapGetter(
  name: string,
  original: () => unknown,
  store: SnapshotStore,
): () => unknown {
  return () => {
    const callKey = makeCallKey('', name, []);
    const mode = store.mode;

    if (mode === 'replay') {
      const entry = store.get(callKey);
      if (!entry) throw new UnimockReplayMissError(callKey, name, []);
      if (entry.result.t === 'ref')
        return new ConnectionHandler(null, entry.result.v, store);
      return deserialize(entry.result);
    }

    const result = original();
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
