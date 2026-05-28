import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import {
  ISerializer,
  MockableOptions,
  SnapshotCallEntry,
  SnapshotFile,
  SnapshotResult,
  UnimockMode,
} from './interfaces';
import { isUnimockUpdate, resolveMode, resolveSnapshotDir } from './env';
import { deserializeValue, serializeValue } from './serialize';

const stores = new Set<SnapshotStore>();

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

  public constructor(
    public readonly className: string,
    options?: MockableOptions,
  ) {
    this.serializers = options?.serializers ?? [];
    this.snapshotPath = SnapshotStore.resolvePath(className, options);
    this.data = this.load();
    stores.add(this);
  }

  public get mode(): UnimockMode {
    return resolveMode(this.snapshotPath);
  }

  public static resolvePath(className: string, options?: MockableOptions): string {
    if (options?.snapshot) {
      return isAbsolute(options.snapshot)
        ? options.snapshot
        : resolve(process.cwd(), options.snapshot);
    }
    const dir = resolveSnapshotDir(options?.snapshotDir ?? globalSnapshotDir);
    return resolve(process.cwd(), dir, `${className}.unimock.json`);
  }

  public get isReplay(): boolean {
    return this.mode === 'replay';
  }

  public shouldPersist(): boolean {
    return this.mode === 'record' || (this.mode === 'live' && isUnimockUpdate());
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

  public record(
    callKey: string,
    args: unknown[],
    result: unknown,
    refId?: string,
  ): void {
    if (!this.shouldPersist()) return;
    this.data.calls[callKey] = {
      args: args.map((arg) => serializeValue(arg, this.serializers)),
      result: this.packResult(result, refId),
    };
    this.dirty = true;
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
    if (!this.dirty || !this.shouldPersist()) return;
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
          return { version: 1, className: this.className, calls: { ...parsed.calls } };
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

export function getSnapshotStore(className: string, options?: MockableOptions): SnapshotStore {
  return new SnapshotStore(className, options);
}

process.on('beforeExit', () => flushAllSnapshots());
