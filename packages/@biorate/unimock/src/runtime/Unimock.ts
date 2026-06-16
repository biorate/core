import { parseUnimockEnv, resolveMode, resolveSnapshotDir } from '../env';
import { defaultSerializers } from './serializers';
import { SnapshotStore, resolveSnapshotFilePath } from './SnapshotStore';
import type {
  SnapshotCallEntry,
  SnapshotResult,
  UnimockConfig,
  UnimockMode,
} from '../types';
import { UnimockReplayMissError } from '../errors';
import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

type Scope = {
  testName?: string;
  counters: Map<string, number>;
};

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

export class UnimockRuntime {
  #overrides: Partial<UnimockConfig> = {};
  #scope: Scope = { counters: new Map() };
  #stores = new Map<string, SnapshotStore>();
  #als = new AsyncLocalStorage<{ traceId: string }>();

  public constructor() {
    // Intentionally empty: defaults are env-driven and resolved lazily,
    // so tests can set `process.env.UNIMOCK` before creating DI roots.
  }

  public configure(partial: Partial<UnimockConfig>): void {
    this.#overrides = { ...this.#overrides, ...partial };
  }

  public get mode(): UnimockMode {
    if (this.#overrides.mode) return this.#overrides.mode;
    return resolveMode(parseUnimockEnv());
  }

  public get serializers() {
    return this.#overrides.serializers ?? defaultSerializers;
  }

  public get snapshotDir(): string {
    if (this.#overrides.snapshotDir) return this.#overrides.snapshotDir;
    return resolveSnapshotDir(parseUnimockEnv());
  }

  public get traceId(): string | undefined {
    return this.#als.getStore()?.traceId;
  }

  public setTestName(name: string | undefined): void {
    this.#scope.testName = name;
    this.#scope.counters = new Map();
  }

  public nextCallKey(params: {
    snapshotName: string;
    path: string;
    argsSignature: string;
  }): string {
    const { snapshotName, path, argsSignature } = params;
    const prefix = this.#scope.testName ? `${this.#scope.testName}::` : '';
    const base = `${snapshotName}::${prefix}${path}::${argsSignature}`;
    const prev = this.#scope.counters.get(base) ?? 0;
    const next = prev + 1;
    this.#scope.counters.set(base, next);
    return `${base}#${next}`;
  }

  public getSnapshotStore(snapshotName: string): SnapshotStore {
    const dir = this.snapshotDir;
    const key = `${dir}::${snapshotName}`;
    const existing = this.#stores.get(key);
    if (existing) return existing;
    const filePath = resolveSnapshotFilePath(dir, snapshotName);
    const store = new SnapshotStore(filePath);
    this.#stores.set(key, store);
    return store;
  }

  public flush(): void {
    for (const store of this.#stores.values()) store.flush();
  }

  public interceptCall(params: {
    snapshotName: string;
    path: string;
    args: unknown[];
    invoke: () => unknown;
    serialize: (value: unknown) => unknown;
    isHandleableResult?: (value: unknown) => boolean;
    makeHandleProxy?: (handleId: string, target?: object) => unknown;
  }): unknown {
    const {
      snapshotName,
      path,
      args,
      invoke,
      serialize,
      isHandleableResult,
      makeHandleProxy,
    } = params;
    const store = this.getSnapshotStore(snapshotName);
    const argsSerialized = serialize(args) as unknown;
    const argsSignature = crypto
      .createHash('sha1')
      .update(JSON.stringify(argsSerialized))
      .digest('hex')
      .slice(0, 12);
    const key = this.nextCallKey({ snapshotName, path, argsSignature });

    const mode = this.mode;
    const recorded = store.find(key);

    if (mode === 'off') {
      return invoke();
    }

    if (mode === 'replay') {
      if (!recorded) throw new UnimockReplayMissError(key);
      if (recorded.result.ok) {
        const v = recorded.result.value as any;
        if (makeHandleProxy && v && typeof v === 'object' && v.$handle) {
          return makeHandleProxy(String(v.$handle));
        }
        return recorded.result.value;
      }
      throw recorded.result.error;
    }

    if (recorded) {
      if (recorded.result.ok) {
        const v = recorded.result.value as any;
        if (makeHandleProxy && v && typeof v === 'object' && v.$handle) {
          return makeHandleProxy(String(v.$handle));
        }
        return recorded.result.value;
      }
      throw recorded.result.error;
    }

    const activeTrace = this.traceId;
    const traceId = activeTrace ?? key;
    const result = this.#als.run({ traceId }, () => invoke());

    if (isPromiseLike(result)) {
      return (result as PromiseLike<unknown>).then(
        (value) => {
          const handleable =
            !!makeHandleProxy && !!isHandleableResult && isHandleableResult(value);
          const entry: SnapshotCallEntry = {
            key,
            path,
            args: argsSerialized as unknown[],
            result: {
              ok: true,
              value: handleable ? { $handle: key } : serialize(value),
            } satisfies SnapshotResult,
          };
          if (mode === 'record' || mode === 'auto') store.record(entry);
          return handleable ? makeHandleProxy!(key, value as object) : value;
        },
        (e: unknown) => {
          const entry: SnapshotCallEntry = {
            key,
            path,
            args: argsSerialized as unknown[],
            result: { ok: false, error: serialize(e) } satisfies SnapshotResult,
          };
          if (mode === 'record' || mode === 'auto') store.record(entry);
          throw e;
        },
      );
    }

    const handleable =
      !!makeHandleProxy && !!isHandleableResult && isHandleableResult(result);

    if (mode === 'record' || mode === 'auto') {
      const entry: SnapshotCallEntry = {
        key,
        path,
        args: argsSerialized as unknown[],
        result: {
          ok: true,
          value: handleable ? { $handle: key } : serialize(result),
        } satisfies SnapshotResult,
      };
      store.record(entry);
    }

    return handleable ? makeHandleProxy!(key, result as object) : result;
  }
}

export const Unimock = new UnimockRuntime();

export function configureUnimock(config: Partial<UnimockConfig>): void {
  Unimock.configure(config);
}

export function getSnapshotStore(snapshotName: string): SnapshotStore {
  return Unimock.getSnapshotStore(snapshotName);
}

export function flushAllSnapshots(): void {
  Unimock.flush();
}

