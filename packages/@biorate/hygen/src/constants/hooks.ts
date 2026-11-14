/** @description New class-based action hook files, highest priority first. */
export const ACTION_HOOK_FILES = ['hooks.ts', 'hooks.js', 'hooks.mjs', 'hooks.cjs'];

/** @description Legacy action hook files, kept for backward compatibility. */
export const LEGACY_HOOK_FILES = [
  'index.js',
  'index.ts',
  'prompt.cjs',
  'prompt.js',
  'prompt.ts',
];

/** @description All action hook candidates in resolution order. */
export const HOOK_FILES = [...ACTION_HOOK_FILES, ...LEGACY_HOOK_FILES];

/** @description Valid project-hook lifecycle method names. */
export const LIFECYCLE_METHODS = [
  'beforeAll',
  'beforeEach',
  'afterEach',
  'afterAll',
] as const;
