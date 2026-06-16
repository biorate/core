import path from 'node:path';
import { DEFAULT_SNAPSHOT_DIR } from './runtime/constants';
import type { UnimockEnv, UnimockMode } from './types';

export function parseUnimockEnv(
  env: NodeJS.ProcessEnv = process.env,
): UnimockEnv {
  return {
    UNIMOCK: env.UNIMOCK,
    UNIMOCK_SNAPSHOT_DIR: env.UNIMOCK_SNAPSHOT_DIR,
    UNIMOCK_UPDATE: env.UNIMOCK_UPDATE,
    UNIMOCK_LIVE: env.UNIMOCK_LIVE,
  };
}

function isTruthy(input: string | undefined): boolean {
  if (!input) return false;
  const value = input.toLowerCase();
  return value === '1' || value === 'true' || value === 'yes' || value === 'on';
}

export function resolveMode(env: UnimockEnv): UnimockMode {
  const raw = env.UNIMOCK?.toLowerCase();

  if (!raw || raw === 'off' || raw === '0' || raw === 'false') {
    // Backward-compatible behaviour for existing packages/tests.
    if (isTruthy(env.UNIMOCK_UPDATE)) return 'record';
    if (isTruthy(env.UNIMOCK_LIVE)) return 'off';
    return 'off';
  }

  if (raw === 'record' || raw === 'update') return 'record';
  if (raw === 'replay') return 'replay';
  if (raw === 'auto' || raw === '1' || raw === 'true') return 'auto';

  return 'off';
}

export function resolveSnapshotDir(env: UnimockEnv): string {
  return env.UNIMOCK_SNAPSHOT_DIR
    ? path.resolve(process.cwd(), env.UNIMOCK_SNAPSHOT_DIR)
    : path.resolve(process.cwd(), DEFAULT_SNAPSHOT_DIR);
}

