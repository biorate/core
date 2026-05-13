import { describe, expect, it } from 'vitest';
import { unwrapCjsDefaultExport } from '../src/import';

describe('unwrapCjsDefaultExport', () => {
  it('returns a function unchanged', () => {
    const fn = () => 42;
    expect(unwrapCjsDefaultExport<typeof fn>(fn, 'test')).toBe(fn);
  });

  it('unwraps one default layer', () => {
    const fn = function target() {}
    expect(unwrapCjsDefaultExport<typeof fn>({ default: fn }, 'pkg')).toBe(fn);
  });

  it('unwraps two default layers (Node ESM interop for some CJS packages)', () => {
    const fn = function inner() {}
    expect(unwrapCjsDefaultExport<typeof fn>({ default: { default: fn } }, 'pkg')).toBe(fn);
  });

  it('throws when no function is found', () => {
    expect(() => unwrapCjsDefaultExport({ foo: 1 }, 'bad')).toThrow(
      /^bad: expected default export to resolve to a function$/,
    );
  });

  it('throws when default chain exceeds maxDepth', () => {
    const fn = () => {};
    const nested = { default: { default: { default: { default: { default: fn } } } } };
    expect(() => unwrapCjsDefaultExport(nested, 'deep', 3)).toThrow(TypeError);
  });
});
