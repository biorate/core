import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import type { SnapshotCall, SnapshotFile, SnapshotStoreEntry, UnimockMode } from './interfaces';
import { parseUnimockMode, resolveSnapshotDir } from './env';

const stores = new Map<string, SnapshotStore>();

export class SnapshotStore implements SnapshotStoreEntry {
  private static _mode: UnimockMode = parseUnimockMode();

  public static get mode(): UnimockMode {
    return SnapshotStore._mode;
  }

  public static setMode(mode: UnimockMode): void {
    SnapshotStore._mode = mode;
  }

  public readonly className: string;
  public readonly snapshotPath: string;

  private data: SnapshotFile;

  private dirty = false;

  public constructor(className: string, snapshotDir?: string) {
    this.className = className;
    const baseDir = resolveSnapshotDir(snapshotDir);
    this.snapshotPath = resolve(baseDir, `${className}.unimock.json`);
    this.data = this.load();
  }

  private load(): SnapshotFile {
    try {
      if (existsSync(this.snapshotPath)) {
        const raw = readFileSync(this.snapshotPath, 'utf-8');
        return JSON.parse(raw) as SnapshotFile;
      }
    } catch {
      // corrupt file — start fresh
    }
    return { version: 1, className: this.className, calls: {} };
  }

  public get mode(): UnimockMode {
    return SnapshotStore.mode;
  }

  public has(callKey: string): boolean {
    return callKey in this.data.calls;
  }

  public get(callKey: string): SnapshotCall | undefined {
    return this.data.calls[callKey];
  }

  public record(callKey: string, call: SnapshotCall): void {
    this.data.calls[callKey] = call;
    this.dirty = true;
  }

  public flush(): void {
    if (!this.dirty) return;
    const dir = dirname(this.snapshotPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(this.snapshotPath, JSON.stringify(this.data, null, 2), 'utf-8');
    this.dirty = false;
  }
}

export function getSnapshotStore(className: string, snapshotDir?: string): SnapshotStore {
  const key = `${className}::${snapshotDir ?? ''}`;
  let store = stores.get(key);
  if (!store) {
    store = new SnapshotStore(className, snapshotDir);
    stores.set(key, store);
  }
  return store;
}

export function flushAllSnapshots(): void {
  for (const store of stores.values()) store.flush();
}

export { SnapshotStore as SnapshotStoreClass };
