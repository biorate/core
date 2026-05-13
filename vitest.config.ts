import { defineConfig } from 'vitest/config';

/** Monorepo-wide Vitest defaults; packages extend via `mergeConfig` in local `vitest.config.ts`. */
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,ts}'],
    globals: true,
    setupFiles: ['reflect-metadata'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 60000,
    watch: false,
    coverage: {
      provider: 'v8',
    },
  },
});
