import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['reflect-metadata'],
    reporters: [
      'default',
      ['allure-vitest/reporter', { resultsDir: 'allure-results', suiteTitle: false }],
    ],
  },
});
