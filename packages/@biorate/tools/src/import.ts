/**
 * Unwraps CJS `default` when Node ESM `import x from 'pkg'` yields nested `{ default: ... }`
 * (see `inversify-inject-decorators` and similar `__esModule` + `exports.default` builds).
 */
export function unwrapCjsDefaultExport<T>(
  mod: unknown,
  moduleLabel = 'module',
  maxDepth = 4,
): T {
  let current: unknown = mod;
  for (let i = 0; i < maxDepth; i++) {
    if (typeof current === 'function') return current as T;
    current =
      current != null &&
      typeof current === 'object' &&
      Object.prototype.hasOwnProperty.call(current, 'default')
        ? (current as { default: unknown }).default
        : undefined;
  }
  throw new TypeError(`${moduleLabel}: expected default export to resolve to a function`);
}
