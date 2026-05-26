import { defineConfig, mergeConfig } from 'vitest/config';
import vitestRoot from '../../../vitest.config';

export default mergeConfig(
  vitestRoot,
  defineConfig({
    test: {
      setupFiles: ['allure-vitest/setup'],
      reporters: [
        'default',
        ['allure-vitest/reporter', { resultsDir: 'allure-results', suiteTitle: false }],
      ],
    },
  }),
);
