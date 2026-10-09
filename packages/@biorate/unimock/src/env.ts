import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import type { UnimockMode } from './interfaces';
import { getUnimockFileConfig } from './file-config';
import {
  MODE_RECORD,
  MODE_REPLAY,
  MODE_OFF,
  DEFAULT_SNAPSHOT_DIR,
  SNAPSHOTS_DIR_NAME,
} from './constants';

function envFlag(name: string): boolean {
  return process.env[name] === '1';
}

/** @description Boolean file-config key; `undefined` when absent or not a native boolean. */
function fileBoolean(key: string): boolean | undefined {
  const value = getUnimockFileConfig()[key];
  return typeof value === 'boolean' ? value : undefined;
}

/** @description Finite file-config number; `undefined` when absent or not a native number. */
function fileNumber(key: string): number | undefined {
  const value = getUnimockFileConfig()[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function parseModeValue(value: string | undefined): UnimockMode {
  const env = value?.toLowerCase().trim();
  if (!env || env === MODE_OFF || env === '0' || env === 'false') return MODE_OFF;
  if (env === MODE_RECORD || env === 'update' || env === '1' || env === 'true')
    return MODE_RECORD;
  if (env === MODE_REPLAY) return MODE_REPLAY;
  return MODE_OFF;
}

export function parseUnimockMode(value?: string): UnimockMode {
  if (value !== undefined) return parseModeValue(value);
  const file = getUnimockFileConfig();
  if (typeof file.mode === 'string') return parseModeValue(file.mode);
  return parseModeValue(process.env.UNIMOCK);
}

export function resolveSnapshotDir(override?: string, importMeta?: ImportMeta): string {
  if (override) return override;
  if (importMeta) {
    return resolve(dirname(fileURLToPath(importMeta.url)), SNAPSHOTS_DIR_NAME);
  }
  const file = getUnimockFileConfig();
  if (typeof file.snapshotDir === 'string' && file.snapshotDir.length > 0)
    return file.snapshotDir;
  return process.env.UNIMOCK_SNAPSHOT_DIR ?? DEFAULT_SNAPSHOT_DIR;
}

export function gzipEnabled(): boolean {
  const file = fileBoolean('gzip');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_GZIP');
}

export function valuePoolEnabled(): boolean {
  const file = fileBoolean('valuePool');
  if (file !== undefined) return file;
  return process.env.UNIMOCK_VALUE_POOL !== '0';
}

export function valuePoolThreshold(): number {
  const file = fileNumber('valuePoolThreshold');
  if (file !== undefined && file > 0) return file;
  const n = Number(process.env.UNIMOCK_VALUE_POOL_THRESHOLD);
  return Number.isFinite(n) && n > 0 ? n : 100_000;
}

export function valuePoolCountLimit(): number {
  const file = fileNumber('valuePoolCountLimit');
  if (file !== undefined && file > 0) return file;
  const n = Number(process.env.UNIMOCK_VALUE_POOL_COUNT_LIMIT);
  return Number.isFinite(n) && n > 0 ? n : 2_000;
}

export function stripRequestEnabled(): boolean {
  const file = fileBoolean('stripRequest');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_STRIP_REQUEST');
}

export function skipProxyArgsEnabled(): boolean {
  const file = fileBoolean('skipProxyArgs');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_SKIP_CONN_ARGS') || envFlag('UNIMOCK_SKIP_PROXY_ARGS');
}

export function rowPoolEnabled(): boolean {
  const file = fileBoolean('rowPool');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_ROW_POOL');
}

export function compactEnabled(): boolean {
  const file = fileBoolean('compact');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_COMPACT');
}

export function fallbackOnMissEnabled(): boolean {
  const file = fileBoolean('fallbackOnMiss');
  if (file !== undefined) return file;
  return envFlag('UNIMOCK_FALLBACK_ON_MISS');
}
