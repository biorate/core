import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['reflect-metadata'],
    exclude: ['node_modules', 'dist'],
  },
  esbuild: {
    format: 'esm',
  },
});
