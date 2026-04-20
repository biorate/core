import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,ts}'],
    globals: true,
    testTimeout: 60000,
    watch: false,
    coverage: {
      provider: 'v8',
    },
  },
});
