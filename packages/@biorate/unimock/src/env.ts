import { join } from 'path';
import { UnimockMode } from './interfaces';
import { isReplayableSnapshotFile } from './snapshot-path';

/** @description Default snapshot directory relative to `process.cwd()`. */
export const DEFAULT_SNAPSHOT_DIR = join('tests', '__snapshots__');

/** @description Whether unimock proxy is active (`UNIMOCK` is not `0` / `false`). */
export function isUnimockEnabled(): boolean {
  const value = process.env.UNIMOCK?.toLowerCase();
  return value !== '0' && value !== 'false';
}

export function isUnimockUpdate(): boolean {
  const value = process.env.UNIMOCK_UPDATE?.toLowerCase();
  return value === '1' || value === 'true';
}

export function isUnimockLive(): boolean {
  const value = process.env.UNIMOCK_LIVE?.toLowerCase();
  return value === '1' || value === 'true';
}

export function resolveSnapshotDir(override?: string): string {
  return (
    override ??
    process.env.UNIMOCK_SNAPSHOT_DIR ??
    process.env.UNIMOCK_SNAPSHOTS_DIR ??
    DEFAULT_SNAPSHOT_DIR
  );
}

/** @description Resolve record / replay / live from env and snapshot file. */
export function resolveMode(snapshotPath: string, className?: string): UnimockMode {
  if (isUnimockLive()) return 'live';
  if (isUnimockUpdate()) return 'record';
  if (isReplayableSnapshotFile(snapshotPath, className)) return 'replay';
  return 'record';
}
