type Ctx = { name?: string; dry?: boolean };

const log = (entry: string): void => {
  const g = globalThis as { __hookLog?: string[] };
  if (g.__hookLog) g.__hookLog.push(entry);
};

const maybeThrow = (phase: string, ctx: Ctx): void => {
  log(`${phase}:${ctx.dry === true}`);
  const g = globalThis as {
    __hookFail?: Record<string, string | { message: string; name?: string }>;
  };
  const rule = g.__hookFail?.[phase];
  if (!rule) return;
  if (typeof rule === 'string') throw new Error(rule);
  if (rule.name === undefined || rule.name === ctx.name) throw new Error(rule.message);
};

export default class {
  async beforeAll(ctx: Ctx): Promise<void> {
    maybeThrow('beforeAll', ctx);
  }

  async beforeEach(ctx: Ctx): Promise<void> {
    maybeThrow('beforeEach', ctx);
  }

  async afterEach(ctx: Ctx): Promise<void> {
    maybeThrow('afterEach', ctx);
  }

  async afterAll(ctx: Ctx): Promise<void> {
    maybeThrow('afterAll', ctx);
  }
}
