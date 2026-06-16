import fs from 'node:fs';
import path from 'node:path';
import { SNAPSHOT_FILE_EXT } from './constants';
import type { SnapshotCallEntry, SnapshotFile } from '../types';

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

export function resolveSnapshotFilePath(
  snapshotDir: string,
  snapshotName: string,
): string {
  return path.join(snapshotDir, `${snapshotName}${SNAPSHOT_FILE_EXT}`);
}

export function isReplayableSnapshotFile(file: unknown): file is SnapshotFile {
  if (!file || typeof file !== 'object') return false;
  const f = file as SnapshotFile;
  return f.version === 1 && Array.isArray(f.calls);
}

export class SnapshotStore {
  readonly #filePath: string;
  #loaded: SnapshotFile | null = null;
  #dirtyCalls: SnapshotCallEntry[] = [];

  public constructor(filePath: string) {
    this.#filePath = filePath;
  }

  public get filePath(): string {
    return this.#filePath;
  }

  public load(): SnapshotFile {
    if (this.#loaded) return this.#loaded;
    if (!fs.existsSync(this.#filePath)) {
      this.#loaded = { version: 1, calls: [] };
      return this.#loaded;
    }
    const text = fs.readFileSync(this.#filePath, 'utf8');
    const parsed: unknown = JSON.parse(text);
    if (isReplayableSnapshotFile(parsed)) {
      this.#loaded = parsed;
      return this.#loaded;
    }
    this.#loaded = { version: 1, calls: [] };
    return this.#loaded;
  }

  public find(key: string): SnapshotCallEntry | undefined {
    const file = this.load();
    return file.calls.find((c) => c.key === key);
  }

  public record(entry: SnapshotCallEntry): void {
    this.load();
    this.#dirtyCalls.push(entry);
  }

  public flush(): void {
    if (!this.#dirtyCalls.length) return;
    const file = this.load();
    file.calls.push(...this.#dirtyCalls);
    this.#dirtyCalls = [];
    ensureDir(path.dirname(this.#filePath));
    fs.writeFileSync(this.#filePath, JSON.stringify(file, null, 2));
  }
}

