import { MockableOptions, SnapshotResult } from './interfaces';
import { UnimockReplayMissError } from './errors';
import { SnapshotStore } from './snapshot-store';
import { deserializeValue, makeCallKey } from './serialize';

const INFRA_METHODS = new Set(['initialize', 'create', 'connect']);
const replayStubs = new WeakSet<object>();
const proxyTargets = new WeakMap<object, object>();
const autoMockedObjects = new WeakMap<object, object>();

/** @description Real instance behind a {@link createMockProxy} wrapper. */
export function unwrapMockTarget<T extends object>(value: T): T {
  return (proxyTargets.get(value) as T | undefined) ?? value;
}

function hasMethods(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) return false;
  const methods = Object.getOwnPropertyNames(proto).filter(
    (p) => p !== 'constructor' && typeof (value as Record<string, unknown>)[p] === 'function',
  );
  return methods.length > 0;
}

function wrapWithAutoMock<T extends object>(
  obj: T,
  store: SnapshotStore,
  options: MockableOptions | undefined,
  nodeId: string,
): T {
  const existing = autoMockedObjects.get(obj);
  if (existing) return existing as T;

  const handler: ProxyHandler<T> = {
    get(target, prop, receiver) {
      if (prop === 'then') return undefined;
      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop, receiver);
      }

      const value = Reflect.get(target, prop, receiver);

      if (typeof value === 'function') {
        const method = value as (...args: unknown[]) => unknown;
        return (...args: unknown[]) =>
          invokeMethod(target, String(prop), method, args, store, options, nodeId);
      }

      if (options?.autoMockNested !== false && typeof value === 'object' && value !== null && hasMethods(value)) {
        const nestedProxy = createMockProxy(value as object, store, options, `${nodeId}|${String(prop)}`);
        return wrapWithAutoMock(nestedProxy, store, options, `${nodeId}|${String(prop)}`);
      }

      return value;
    },
  };

  const proxy = new Proxy(obj, handler);
  autoMockedObjects.set(obj, proxy);
  return proxy;
}

export function createMockProxy<T extends object>(
  target: T,
  store: SnapshotStore,
  options: MockableOptions | undefined,
  nodeId: string,
): T {
  const handler: ProxyHandler<T> = {
    get(trapTarget, prop, _receiver) {
      if (prop === 'then') return undefined;
      if (typeof prop === 'symbol') {
        return Reflect.get(trapTarget, prop, trapTarget);
      }

      const value = Reflect.get(trapTarget, prop, trapTarget);

      if (typeof value === 'function') {
        const method = value as (...args: unknown[]) => unknown;
        return (...args: unknown[]) =>
          invokeMethod(trapTarget, String(prop), method, args, store, options, nodeId);
      }

      if (
        store.isReplay &&
        replayStubs.has(trapTarget) &&
        typeof prop === 'string' &&
        value === undefined
      ) {
        return (...args: unknown[]) =>
          invokeMethod(trapTarget, prop, () => undefined, args, store, options, nodeId);
      }

      if (options?.autoMockNested !== false && typeof value === 'object' && value !== null && hasMethods(value)) {
        const nestedProxy = createMockProxy(value as object, store, options, `${nodeId}|${String(prop)}`);
        return wrapWithAutoMock(nestedProxy, store, options, `${nodeId}|${String(prop)}`);
      }

      return value;
    },
  };

  const proxy = new Proxy(target, handler);
  proxyTargets.set(proxy, target);
  return proxy;
}

function invokeMethod(
  target: object,
  method: string,
  fn: (...args: unknown[]) => unknown,
  args: unknown[],
  store: SnapshotStore,
  options: MockableOptions | undefined,
  nodeId: string,
): unknown {
  const callKey = makeCallKey(nodeId, method, args);

  if (store.isReplay) {
    if (INFRA_METHODS.has(method)) return undefined;
    const entry = store.get(callKey);
    if (!entry) throw new UnimockReplayMissError(callKey);
    return materializeResult(store, options, entry.result);
  }

  return runMethod(target, fn, args, (raw) =>
    wrapResult(raw, store, options, nodeId, callKey, args),
  );
}

function runMethod(
  target: object,
  fn: (...args: unknown[]) => unknown,
  args: unknown[],
  onResolve?: (raw: unknown) => unknown,
): unknown {
  const result = fn.apply(target, args);
  if (result && typeof (result as Promise<unknown>).then === 'function') {
    if (!onResolve) return result;
    return (result as Promise<unknown>).then(onResolve);
  }
  return onResolve ? onResolve(result) : result;
}

function wrapResult(
  raw: unknown,
  store: SnapshotStore,
  options: MockableOptions | undefined,
  nodeId: string,
  callKey: string,
  args: unknown[],
): unknown {
  let refId: string | undefined;
  if (raw !== null && typeof raw === 'object' && typeof raw !== 'function') {
    refId = store.allocateRef();
    store.recordRef(refId, raw);
  }
  store.record(callKey, args, raw, refId);
  if (refId) return createMockProxy(raw as object, store, options, refId);
  return raw;
}

function materializeResult(
  store: SnapshotStore,
  options: MockableOptions | undefined,
  result: SnapshotResult,
): unknown {
  switch (result.kind) {
    case 'void':
      return undefined;
    case 'primitive':
      return deserializeValue(result.value, store.serializers);
    case 'ref': {
      const stub = Object.create(null) as object;
      const state = store.getRef(result.ref);
      if (state && typeof state === 'object' && !Array.isArray(state)) {
        Object.assign(stub, state);
      } else if (state !== undefined) {
        return state;
      }
      replayStubs.add(stub);
      return createMockProxy(stub, store, options, result.ref);
    }
  }
}
