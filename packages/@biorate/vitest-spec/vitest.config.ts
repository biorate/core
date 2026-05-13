import { defineConfig, mergeConfig } from 'vitest/config';
import vitestRoot from '../../../vitest.config';

export default mergeConfig(
  vitestRoot,
  defineConfig({
    test: {
      environment: 'node',
    },
    esbuild: {
      format: 'esm',
    },
  }),
);
