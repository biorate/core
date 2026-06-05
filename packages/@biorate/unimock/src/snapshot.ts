import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export interface CallRecord {
  method: string;
  args: unknown[];
  result?: unknown;
  error?: { name: string; message: string; stack?: string };
  timestamp: number;
  chainId: string;
}

export interface Snapshot {
  chains: Record<string, CallRecord[]>;
  createdAt: number;
  updatedAt: number;
}

export class SnapshotManager {
  private snapshotsDir: string;
  private snapshots: Map<string, Snapshot> = new Map();

  constructor(baseDir: string = process.cwd()) {
    this.snapshotsDir = join(baseDir, '__snapshots__');
  }

  private getSnapshotPath(className: string, snapshotName: string): string {
    return join(this.snapshotsDir, className, `${snapshotName}.json`);
  }

  private ensureDir(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  public load(className: string, snapshotName: string): Snapshot | null {
    const snapshotPath = this.getSnapshotPath(className, snapshotName);
    if (!existsSync(snapshotPath)) {
      return null;
    }
    const content = readFileSync(snapshotPath, 'utf-8');
    return JSON.parse(content) as Snapshot;
  }

  public save(className: string, snapshotName: string, snapshot: Snapshot): void {
    const snapshotPath = this.getSnapshotPath(className, snapshotName);
    this.ensureDir(dirname(snapshotPath));
    writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
  }

  public getOrCreateSnapshot(className: string, snapshotName: string): Snapshot {
    const key = `${className}:${snapshotName}`;
    if (this.snapshots.has(key)) {
      return this.snapshots.get(key)!;
    }
    const loaded = this.load(className, snapshotName);
    if (loaded) {
      this.snapshots.set(key, loaded);
      return loaded;
    }
    const newSnapshot: Snapshot = {
      chains: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.snapshots.set(key, newSnapshot);
    return newSnapshot;
  }

  public addCallRecord(
    className: string,
    snapshotName: string,
    chainId: string,
    record: CallRecord,
  ): void {
    const snapshot = this.getOrCreateSnapshot(className, snapshotName);
    if (!snapshot.chains[chainId]) {
      snapshot.chains[chainId] = [];
    }
    snapshot.chains[chainId].push(record);
    snapshot.updatedAt = Date.now();
    this.snapshots.set(`${className}:${snapshotName}`, snapshot);
  }

  public getChainRecords(
    className: string,
    snapshotName: string,
    chainId: string,
  ): CallRecord[] {
    const snapshot = this.load(className, snapshotName);
    if (!snapshot || !snapshot.chains[chainId]) {
      return [];
    }
    return snapshot.chains[chainId];
  }

  public flush(): void {
    for (const [key, snapshot] of this.snapshots.entries()) {
      const [className, snapshotName] = key.split(':');
      this.save(className, snapshotName, snapshot);
    }
    this.snapshots.clear();
  }

  public clear(className: string, snapshotName: string): void {
    const key = `${className}:${snapshotName}`;
    this.snapshots.delete(key);
    const snapshotPath = this.getSnapshotPath(className, snapshotName);
    if (existsSync(snapshotPath)) {
      import('fs/promises').then((fs) => fs.unlink(snapshotPath));
    }
  }
}

export const defaultSnapshotManager = new SnapshotManager();
