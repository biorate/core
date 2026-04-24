import { createRequire } from 'module';

let cached: NodeRequire | undefined;

export function getRequire(): NodeRequire {
  if (cached) return cached;
  // In ESM `require` is undefined; create one anchored at cwd (common in this repo).
  // In CJS just reuse existing require.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  cached = typeof require === 'undefined' ? createRequire(process.cwd() + '/') : require;
  return cached;
}

