import { join } from 'path';
import { UnimockMode } from './interfaces';
import { isReplayableSnapshotFile } from './snapshot-path';

/** @description Default snapshot directory relative to `process.cwd()`. */
export const DEFAULT_SNAPSHOT_DIR = join('tests', '__snapshots__');

/** @description Resolved `UNIMOCK` env value (proxy and mode selection). */
export type UnimockEnv = 'off' | 'record' | 'replay' | 'auto';

let legacyEnvWarned = false;

function warnLegacyEnv(message: string): void {
  if (legacyEnvWarned) return;
  legacyEnvWarned = true;
  console.warn(`[unimock] ${message}`);
}

function isTruthyEnv(name: string): boolean {
  const value = process.env[name]?.toLowerCase();
  return value === '1' || value === 'true';
}

/** @description Parse `UNIMOCK` and legacy env vars into a single mode. */
export function parseUnimockEnv(): UnimockEnv {
  if (isTruthyEnv('UNIMOCK_LIVE')) {
    warnLegacyEnv('UNIMOCK_LIVE is deprecated; unset UNIMOCK or use UNIMOCK=off for e2e without mocks.');
    return 'off';
  }
  if (isTruthyEnv('UNIMOCK_UPDATE')) {
    warnLegacyEnv('UNIMOCK_UPDATE is deprecated; use UNIMOCK=record to re-record snapshots.');
    return 'record';
  }

  const raw = process.env.UNIMOCK?.trim().toLowerCase();
  if (!raw) return 'off';

  if (raw === '0' || raw === 'false' || raw === 'off') return 'off';
  if (raw === 'record' || raw === 'update') return 'record';
  if (raw === 'replay') return 'replay';
  if (raw === 'auto' || raw === '1' || raw === 'true') return 'auto';

  warnLegacyEnv(`Unknown UNIMOCK="${process.env.UNIMOCK}"; treating as off.`);
  return 'off';
}

/** @description Whether the unimock proxy is active. */
export function isUnimockEnabled(): boolean {
  return parseUnimockEnv() !== 'off';
}

export function resolveSnapshotDir(override?: string): string {
  return (
    override ??
    process.env.UNIMOCK_SNAPSHOT_DIR ??
    process.env.UNIMOCK_SNAPSHOTS_DIR ??
    DEFAULT_SNAPSHOT_DIR
  );
}

/** @description Resolve record / replay from env and snapshot file. */
export function resolveMode(snapshotPath: string, className?: string): UnimockMode {
  const env = parseUnimockEnv();
  if (env === 'off') return 'record';
  if (env === 'record') return 'record';
  if (env === 'replay') return 'replay';
  if (isReplayableSnapshotFile(snapshotPath, className)) return 'replay';
  return 'record';
}
