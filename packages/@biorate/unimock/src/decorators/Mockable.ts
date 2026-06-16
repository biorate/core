import type { Constructor, MockableOptions } from '../types';
import { Unimock } from '../runtime/Unimock';
import { serializeWith } from '../runtime/serializers';
import { UnimockReplayMissError } from '../errors';

const IGNORED_PROPS = new Set<PropertyKey>([
  'constructor',
  '__proto__',
  'prototype',
  'name',
  'length',
  'then',
]);

const CONNECTOR_STRUCTURAL_KEYS = new Set<PropertyKey>([
  'connections',
  'current',
  'use',
  'create',
  'connection',
  'get',
  'initialize',
]);

const NON_SNAPSHOT_METHODS = new Set<PropertyKey>([
  'on',
  'once',
  'addListener',
  'removeListener',
  'off',
  'emit',
  'pipe',
  'unpipe',
  'pause',
  'resume',
]);

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

function isPromiseLike(value: unknown): boolean {
  return (
    isObject(value) && typeof (value as { then?: unknown }).then === 'function'
  );
}

function shouldProxyObject(value: unknown): value is object {
  if (!isObject(value)) return false;
  if (value instanceof Date) return false;
  if (value instanceof Error) return false;
  if (isPromiseLike(value)) return false;
  return true;
}

function isOpaqueHandle(value: unknown): value is object {
  if (!shouldProxyObject(value)) return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto !== Object.prototype && proto !== null;
}

function wrapCallbacks(params: {
  snapshotName: string;
  basePath: string;
  args: unknown[];
}): unknown[] {
  const { snapshotName, basePath, args } = params;
  const trace = Unimock.traceId;
  const prefix = trace ? `trace(${trace}).` : '';
  return args.map((arg, index) => {
    if (typeof arg !== 'function') return arg;
    const original = arg as (...a: any[]) => any;
    const cbPath = `${prefix}${basePath}.callback[${index}]`;
    return function (this: unknown, ...cbArgs: unknown[]) {
      return Unimock.interceptCall({
        snapshotName,
        path: cbPath,
        args: cbArgs,
        invoke: () => Reflect.apply(original, this, cbArgs),
        serialize: (v) => serializeWith(v, Unimock.serializers),
        isHandleableResult: isOpaqueHandle,
        makeHandleProxy: () => {
          throw new UnimockReplayMissError(`${snapshotName}::${cbPath}`);
        },
      });
    };
  });
}

function joinPath(parts: readonly (string | symbol)[]): string {
  if (!parts.length) return '(root)';
  return parts
    .map((p) => (typeof p === 'symbol' ? `Symbol(${p.description ?? ''})` : p))
    .join('.');
}

function proxyValue(params: {
  snapshotName: string;
  target: object;
  pathParts: readonly (string | symbol)[];
  makeHandleProxy: (handleId: string, target?: object) => unknown;
}): any {
  const { snapshotName, target, pathParts, makeHandleProxy } = params;

  return new Proxy(target as any, {
    get(t, prop, _receiver) {
      if (typeof prop === 'symbol') {
        return Reflect.get(t, prop, t);
      }
      if (IGNORED_PROPS.has(prop)) return Reflect.get(t, prop, t);

      const nextPathParts = [...pathParts, prop];
      const value = Reflect.get(t, prop, t);

      if (typeof value === 'function') {
        const path = joinPath(nextPathParts);
        if (NON_SNAPSHOT_METHODS.has(prop)) {
          return (...args: unknown[]) => Reflect.apply(value, t, args);
        }
        return (...args: unknown[]) =>
          Unimock.interceptCall({
            snapshotName,
            path,
            args,
            invoke: () =>
              Reflect.apply(
                value,
                t,
                wrapCallbacks({ snapshotName, basePath: path, args }),
              ),
            serialize: (v) => serializeWith(v, Unimock.serializers),
            isHandleableResult: isOpaqueHandle,
            makeHandleProxy,
          });
      }

      if (shouldProxyObject(value)) {
        return proxyValue({
          snapshotName,
          target: value,
          pathParts: nextPathParts,
          makeHandleProxy,
        });
      }

      return value;
    },
  });
}

function replayProxy(params: {
  snapshotName: string;
  handleId: string;
  pathParts: readonly (string | symbol)[];
  makeHandleProxy: (handleId: string, target?: object) => unknown;
}): any {
  const { snapshotName, handleId, pathParts, makeHandleProxy } = params;

  return new Proxy(Object.create(null) as any, {
    get(_t, prop) {
      if (typeof prop === 'symbol') return undefined;
      if (IGNORED_PROPS.has(prop)) return undefined;
      const nextPath = joinPath([...pathParts, prop]);
      return (...args: unknown[]) =>
        Unimock.interceptCall({
          snapshotName,
          path: nextPath,
          args,
          invoke: () => {
            throw new UnimockReplayMissError(
              `${snapshotName}::${nextPath} (no live target)`,
            );
          },
          serialize: (v) => serializeWith(v, Unimock.serializers),
          isHandleableResult: isOpaqueHandle,
          makeHandleProxy,
        });
    },
  });
}

function wrapReturnValue(params: {
  snapshotName: string;
  value: unknown;
  pathParts: readonly (string | symbol)[];
  makeHandleProxy: (handleId: string, target?: object) => unknown;
}): unknown {
  const { snapshotName, value, pathParts, makeHandleProxy } = params;
  if (isPromiseLike(value)) {
    return (value as PromiseLike<unknown>).then((v) =>
      wrapReturnValue({ snapshotName, value: v, pathParts, makeHandleProxy }),
    );
  }
  if (shouldProxyObject(value)) {
    return proxyValue({ snapshotName, target: value, pathParts, makeHandleProxy });
  }
  return value;
}

function installMockable(instance: object, snapshotName: string): void {
  const makeHandleProxy = (handleId: string, target?: object): unknown => {
    const handlePathParts: (string | symbol)[] = [`@${handleId}`];
    return target
      ? proxyValue({
          snapshotName,
          target,
          pathParts: handlePathParts,
          makeHandleProxy,
        })
      : replayProxy({
          snapshotName,
          handleId,
          pathParts: handlePathParts,
          makeHandleProxy,
        });
  };

  const installed = new Set<PropertyKey>();
  let proto = Object.getPrototypeOf(instance);

  while (proto && proto !== Object.prototype) {
    for (const key of Reflect.ownKeys(proto)) {
      if (installed.has(key)) continue;
      installed.add(key);
      if (IGNORED_PROPS.has(key)) continue;

      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (!desc) continue;

      if (typeof desc.value === 'function') {
        const original = desc.value;
        Object.defineProperty(instance, key, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: function (...args: unknown[]) {
            if (CONNECTOR_STRUCTURAL_KEYS.has(key)) {
              const out = Reflect.apply(original, this, args);
              return wrapReturnValue({
                snapshotName,
                value: out,
                pathParts: [key],
                makeHandleProxy,
              });
            }
            if (NON_SNAPSHOT_METHODS.has(key)) return Reflect.apply(original, this, args);

            return Unimock.interceptCall({
              snapshotName,
              path: joinPath([key]),
              args,
              invoke: () =>
                Reflect.apply(
                  original,
                  this,
                  wrapCallbacks({
                    snapshotName,
                    basePath: joinPath([key]),
                    args,
                  }),
                ),
              serialize: (v) => serializeWith(v, Unimock.serializers),
              isHandleableResult: isOpaqueHandle,
              makeHandleProxy,
            });
          },
        });
      }

      if (typeof desc.get === 'function') {
        const originalGet = desc.get;
        Object.defineProperty(instance, key, {
          configurable: true,
          enumerable: desc.enumerable ?? false,
          get: function () {
            if (CONNECTOR_STRUCTURAL_KEYS.has(key)) {
              const out = Reflect.apply(originalGet, this, []);
              return wrapReturnValue({
                snapshotName,
                value: out,
                pathParts: [key],
                makeHandleProxy,
              });
            }

            return Unimock.interceptCall({
              snapshotName,
              path: joinPath([key]),
              args: [],
              invoke: () => Reflect.apply(originalGet, this, []),
              serialize: (v) => serializeWith(v, Unimock.serializers),
              isHandleableResult: isOpaqueHandle,
              makeHandleProxy,
            });
          },
        });
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
}

export function unwrapMockTarget<T>(value: T): T {
  // For future: allow unwrapping if we store WeakMap(proxy->target).
  return value;
}

export function Mockable(options: MockableOptions = {}) {
  return function <T extends Constructor>(Class: T): T {
    const snapshotName = options.snapshotName ?? Class.name;

    const Decorated = class extends (Class as Constructor) {
      public constructor(...args: any[]) {
        super(...args);

        if (Unimock.mode !== 'off') installMockable(this, snapshotName);
      }
    };

    Object.defineProperty(Decorated, 'name', { value: Class.name });
    return Decorated as unknown as T;
  };
}

