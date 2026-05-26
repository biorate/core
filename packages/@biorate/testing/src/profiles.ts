import type { TestProfile } from './types';

export type { TestProfile };

const PROFILE_ENV = 'BIORATE_TEST_PROFILE';

/** @description Resolves profile from explicit value or `BIORATE_TEST_PROFILE` (default: memory). */
export function resolveTestProfile(profile?: TestProfile | string): TestProfile {
  const raw = profile ?? process.env[PROFILE_ENV] ?? 'memory';
  if (raw === 'memory' || raw === 'docker') return raw;
  throw new Error(`Invalid ${PROFILE_ENV}: "${raw}". Expected "memory" or "docker".`);
}

/** @description Active profile from environment (default: memory). */
export const TEST_PROFILE = resolveTestProfile();
