import context from '../src/context';
import type { RunnerContextConfig } from '../src/types';

describe('context', () => {
  it('should populate with capitalized keys', () => {
    const ctx = context({ name: 'foobar' }) as { h: Record<string, unknown> };
    delete ctx.h.path; // platform dependent
    expect(ctx).toMatchSnapshot();
  });
  it('allows helpers to be initialized with current context', () => {
    const helpers = (args: unknown, ctx: RunnerContextConfig) => ({
      testArgs: () => args,
      testCtx: () => ctx,
    });
    const locals = {};
    const config = {
      helpers,
    };
    const ctx = context(locals, config) as unknown as {
      h: Record<string, (...args: unknown[]) => unknown>;
    };
    expect(typeof ctx.h.testArgs).toBe('function');
    expect(typeof ctx.h.testCtx).toBe('function');
    expect(ctx.h.testArgs()).toBe(locals);
    expect(ctx.h.testCtx()).toBe(config);
  });
});
