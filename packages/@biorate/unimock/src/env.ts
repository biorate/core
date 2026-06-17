import type { UnimockMode } from './interfaces';
import { MODE_RECORD, MODE_REPLAY, MODE_OFF, DEFAULT_SNAPSHOT_DIR } from './constants';

/**
 * @description Parses the `UNIMOCK` environment variable into a mode enum.
 *   - `off` / `0` / `false` / unset → {@link MODE_OFF}
 *   - `record` / `update` / `1` / `true` → {@link MODE_RECORD}
 *   - `replay` → {@link MODE_REPLAY}
 */
export function parseUnimockMode(): UnimockMode {
  const env = process.env.UNIMOCK?.toLowerCase().trim();
  if (!env || env === MODE_OFF || env === '0' || env === 'false') return MODE_OFF;
  if (env === MODE_RECORD || env === 'update' || env === '1' || env === 'true')
    return MODE_RECORD;
  if (env === MODE_REPLAY) return MODE_REPLAY;
  return MODE_OFF;
}

/**
 * @description Resolves the snapshot directory path.
 *   Priority: explicit `override` → `UNIMOCK_SNAPSHOT_DIR` env → default.
 * @param override - optional explicit path override
 */
export function resolveSnapshotDir(override?: string): string {
  return override ?? process.env.UNIMOCK_SNAPSHOT_DIR ?? DEFAULT_SNAPSHOT_DIR;
}

/**
 * @description Whether gzip compression of snapshot files is enabled (`UNIMOCK_GZIP=1`).
 */
export function gzipEnabled(): boolean {
  return process.env.UNIMOCK_GZIP === '1';
}

/**
 * @description Whether the `request` field should be stripped from serialized objects
 *   (`UNIMOCK_STRIP_REQUEST=1`). Useful for removing Axios HTTP internals that bloat snapshots.
 */
export function stripRequestEnabled(): boolean {
  return process.env.UNIMOCK_STRIP_REQUEST === '1';
}

/**
 * @description Whether `args` should be omitted for `conn:*` snapshot entries
 *   (`UNIMOCK_SKIP_CONN_ARGS=1`). Args are not used in replay for connection-level calls.
 */
export function skipConnArgsEnabled(): boolean {
  return process.env.UNIMOCK_SKIP_CONN_ARGS === '1';
}
