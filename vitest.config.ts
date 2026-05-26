import { defineConfig } from 'vitest/config';

/** Monorepo-wide Vitest defaults; packages extend via `mergeConfig` in local `vitest.config.ts`. */
export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['reflect-metadata'],
    exclude: ['node_modules', 'dist', '.tools/**'],
    watch: false,
    coverage: {
      provider: 'v8',
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.spec.ts'],
          env: {
            BIORATE_TEST_PROFILE: 'memory',
          },
          testTimeout: 5000,
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['**/*.{test,spec}.{js,ts}'],
          exclude: ['**/*.unit.spec.ts'],
          env: {
            BIORATE_TEST_PROFILE: 'docker',
          },
          testTimeout: 60000,
        },
      },
    ],
  },
});
