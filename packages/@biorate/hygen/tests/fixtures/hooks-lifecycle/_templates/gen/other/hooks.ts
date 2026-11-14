type Ctx = { name?: string; action: string; dry: boolean; subaction?: string };

const log = (entry: string): void => {
  const g = globalThis as { __hookLog?: string[] };
  if (g.__hookLog) g.__hookLog.push(entry);
};

export default class {
  private seen = 0;

  async beforeAll(ctx: Ctx): Promise<void> {
    log(`action.beforeAll:${ctx.action}:${ctx.name ?? '-'}`);
  }

  async beforeEach(ctx: Ctx): Promise<void> {
    this.seen += 1;
    log(`action.beforeEach:${ctx.name ?? '-'}:${this.seen}:${ctx.dry}`);
  }

  async afterEach(ctx: Ctx, results: unknown[]): Promise<void> {
    log(`action.afterEach:${ctx.name ?? '-'}:${this.seen}:${results.length}`);
  }

  async afterAll(ctx: Ctx, results: unknown[]): Promise<void> {
    log(`action.afterAll:${ctx.action}:${results.length}`);
  }

  async prompt(): Promise<Record<string, unknown>> {
    log('action.prompt');
    return {};
  }
}
