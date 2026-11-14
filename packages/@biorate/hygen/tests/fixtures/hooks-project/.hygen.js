const log = (entry) => {
  if (globalThis.__hookLog) globalThis.__hookLog.push(entry);
};

module.exports = {
  hooks: {
    beforeAll() {
      log('project.beforeAll');
    },
    beforeEach(ctx) {
      log(`project.beforeEach:${ctx.name ?? '-'}`);
    },
    afterEach(ctx, results) {
      log(`project.afterEach:${ctx.name ?? '-'}:${results.length}`);
    },
    afterAll(ctx, results) {
      log(`project.afterAll:${results.length}`);
    },
    ignoredValue: 42,
  },
};
