import { defineConfig, mergeConfig } from 'vitest/config';
import rootConfig from '../../../vitest.config';

export default defineConfig(mergeConfig(rootConfig, {
  test: {
    setupFiles: ['reflect-metadata', './vitest.setup.ts'],
  },
}));
