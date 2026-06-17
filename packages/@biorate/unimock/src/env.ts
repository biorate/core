import type { UnimockMode } from './interfaces';
import { MODE_RECORD, MODE_REPLAY, MODE_OFF, DEFAULT_SNAPSHOT_DIR } from './constants';

function envFlag(name: string): boolean {
  return process.env[name] === '1';
}

export function parseUnimockMode(): UnimockMode {
  const env = process.env.UNIMOCK?.toLowerCase().trim();
  if (!env || env === MODE_OFF || env === '0' || env === 'false') return MODE_OFF;
  if (env === MODE_RECORD || env === 'update' || env === '1' || env === 'true')
    return MODE_RECORD;
  if (env === MODE_REPLAY) return MODE_REPLAY;
  return MODE_OFF;
}

export function resolveSnapshotDir(override?: string): string {
  return override ?? process.env.UNIMOCK_SNAPSHOT_DIR ?? DEFAULT_SNAPSHOT_DIR;
}

export function gzipEnabled(): boolean {
  return envFlag('UNIMOCK_GZIP');
}
export function stripRequestEnabled(): boolean {
  return envFlag('UNIMOCK_STRIP_REQUEST');
}
export function skipConnArgsEnabled(): boolean {
  return envFlag('UNIMOCK_SKIP_CONN_ARGS');
}
