import { defineConfig, mergeConfig } from 'vitest/config';
import vitestRoot from '../../../vitest.config';

export default mergeConfig(
  vitestRoot,
  defineConfig({
    test: {
      reporters: [
        'default',
        ['allure-vitest/reporter', { resultsDir: 'allure-results', suiteTitle: false }],
      ],
    },
  }),
);
