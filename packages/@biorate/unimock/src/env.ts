import type { UnimockMode } from './interfaces';

export function parseUnimockMode(): UnimockMode {
  const env = process.env.UNIMOCK?.toLowerCase().trim();
  if (!env || env === 'off' || env === '0' || env === 'false') return 'off';
  if (env === 'record' || env === 'update' || env === '1' || env === 'true') return 'record';
  if (env === 'replay') return 'replay';
  return 'off';
}

export function resolveSnapshotDir(override?: string): string {
  return override ?? process.env.UNIMOCK_SNAPSHOT_DIR ?? 'tests/__snapshots__';
}
