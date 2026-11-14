const log = (entry: string): void => {
  const g = globalThis as { __helperLog?: string[] };
  if (g.__helperLog) g.__helperLog.push(entry);
};

export default class {
  async beforeAll(): Promise<void> {
    log('silent.beforeAll');
  }

  async beforeEach(): Promise<void> {
    log('silent.beforeEach');
  }

  async afterEach(): Promise<void> {
    log('silent.afterEach');
  }

  async afterAll(): Promise<void> {
    log('silent.afterAll');
  }
}
