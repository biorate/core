import { UnimockMode } from './interfaces';
import { existsSync } from 'fs';

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
    '__snapshots__'
  );
}

/** @description Resolve record / replay / live from env and snapshot file. */
export function resolveMode(snapshotPath: string): UnimockMode {
  if (isUnimockLive()) return 'live';
  if (isUnimockUpdate()) return 'record';
  if (existsSync(snapshotPath)) return 'replay';
  return 'record';
}
