import { defineConfig, mergeConfig } from 'vitest/config';
import rootConfig from '../../../vitest.config.ts';

/** Local extension: the docs site (site/) ships its own node_modules with third-party tests — keep them out of the package test run. */
export default mergeConfig(
  rootConfig,
  defineConfig({
    test: {
      exclude: ['**/site/**'],
    },
  }),
);
