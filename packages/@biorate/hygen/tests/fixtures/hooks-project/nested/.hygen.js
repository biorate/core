module.exports = {
  hooks: {
    beforeAll() {
      if (globalThis.__hookLog) globalThis.__hookLog.push('nested.beforeAll');
    },
  },
};
