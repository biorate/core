const log = (entry: string): void => {
  const g = globalThis as { __helperLog?: string[] };
  if (g.__helperLog) g.__helperLog.push(entry);
};

const record = (label: string, h: Record<string, unknown>): void => {
  const g = globalThis as { __helperRefs?: Record<string, unknown>[] };
  if (!g.__helperRefs) g.__helperRefs = [];
  g.__helperRefs.push(h);
  log(`${label}:${String(h.tag)}`);
};

export default class {
  async beforeAll(ctx: { h: Record<string, unknown> }): Promise<void> {
    record('probe.beforeAll', ctx.h);
  }

  async beforeEach(ctx: { h: Record<string, unknown> }): Promise<void> {
    record('probe.beforeEach', ctx.h);
  }

  async afterEach(ctx: { h: Record<string, unknown> }): Promise<void> {
    record('probe.afterEach', ctx.h);
  }

  async afterAll(ctx: { h: Record<string, unknown> }): Promise<void> {
    record('probe.afterAll', ctx.h);
  }
}
