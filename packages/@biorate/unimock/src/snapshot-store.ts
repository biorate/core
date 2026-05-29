import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import {
  ISerializer,
  MockableOptions,
  SnapshotCallEntry,
  SnapshotFile,
  SnapshotResult,
  UnimockMode,
} from './interfaces';
import { resolveMode } from './env';
import { defaultSerializers } from './default-serializers';
import { resolveSnapshotFilePath } from './snapshot-path';
import { deserializeValue, serializeValue } from './serialize';

const stores = new Set<SnapshotStore>();
const storeCache = new Map<string, SnapshotStore>();

let globalSnapshotDir: string | undefined;

/** @description Configure default snapshot directory. */
export function configureUnimock(config: { snapshotDir?: string }): void {
  globalSnapshotDir = config.snapshotDir;
}

export class SnapshotStore {
  public readonly snapshotPath: string;
  public readonly serializers: ISerializer[];
  public dirty = false;
  protected refCounter = 0;
  protected data: SnapshotFile;

  public constructor(public readonly className: string, options?: MockableOptions) {
    this.serializers = [...defaultSerializers, ...(options?.serializers ?? [])];
    this.snapshotPath = SnapshotStore.resolvePath(className, options);
    this.data = this.load();
    stores.add(this);
  }

  public get mode(): UnimockMode {
    return resolveMode(this.snapshotPath, this.className);
  }

  public static resolvePath(className: string, options?: MockableOptions): string {
    return resolveSnapshotFilePath(className, options, globalSnapshotDir);
  }

  public get isReplay(): boolean {
    return this.mode === 'replay';
  }

  public shouldPersist(): boolean {
    return this.mode === 'record';
  }

  public has(callKey: string): boolean {
    return callKey in this.data.calls;
  }

  public get(callKey: string): SnapshotCallEntry | undefined {
    return this.data.calls[callKey];
  }

  public allocateRef(): string {
    this.refCounter += 1;
    return `ref-${this.refCounter}`;
  }

  public record(callKey: string, args: unknown[], result: unknown, refId?: string): void {
    if (!this.shouldPersist()) return;
    try {
      this.data.calls[callKey] = {
        args: args.map((arg) => serializeValue(arg, this.serializers)),
        result: this.packResult(result, refId),
      };
      this.dirty = true;
    } catch {
      // Serialization error — skip recording this call
    }
  }

  public recordRef(refId: string, value: object): void {
    if (!this.shouldPersist()) return;
    if (this.serializers.some((serializer) => serializer.test(value))) return;
    try {
      if (!this.data.refs) this.data.refs = {};
      this.data.refs[refId] = serializeValue(value, this.serializers);
      this.dirty = true;
    } catch {
      // SDK / cyclic object / undefined values — replay uses recorded method calls only
    }
  }

  public getRef(refId: string): unknown | undefined {
    const packed = this.data.refs?.[refId];
    if (packed === undefined) return undefined;
    return deserializeValue(packed, this.serializers);
  }

  public packResult(result: unknown, refId?: string): SnapshotResult {
    if (result === undefined) return { kind: 'void' };
    if (result === null || typeof result !== 'object' || typeof result === 'function') {
      return {
        kind: 'primitive',
        value: serializeValue(result, this.serializers),
      };
    }
    return { kind: 'ref', ref: refId ?? this.allocateRef() };
  }

  public flush(): void {
    if (!this.dirty || !Object.keys(this.data.calls).length) return;
    mkdirSync(dirname(this.snapshotPath), { recursive: true });
    writeFileSync(this.snapshotPath, `${JSON.stringify(this.data, null, 2)}\n`, 'utf-8');
    this.dirty = false;
  }

  protected load(): SnapshotFile {
    try {
      const raw = readFileSync(this.snapshotPath, 'utf-8');
      const parsed = JSON.parse(raw) as SnapshotFile;
      if (parsed.version === 1 && parsed.className === this.className) {
        if (this.shouldPersist()) {
          return {
            version: 1,
            className: this.className,
            calls: { ...parsed.calls },
            refs: parsed.refs ? { ...parsed.refs } : undefined,
          };
        }
        return parsed;
      }
    } catch {
      // no snapshot yet
    }
    return { version: 1, className: this.className, calls: {} };
  }
}

/** @description Persist all dirty snapshot stores. */
export function flushAllSnapshots(): void {
  for (const store of stores) store.flush();
}

export function getSnapshotStore(
  className: string,
  options?: MockableOptions,
): SnapshotStore {
  const path = SnapshotStore.resolvePath(className, options);
  let store = storeCache.get(path);
  if (!store) {
    store = new SnapshotStore(className, options);
    storeCache.set(path, store);
  }
  return store;
}

process.on('beforeExit', () => flushAllSnapshots());
