import { defineConfig, mergeConfig } from 'vitest/config';
import vitestRoot from '../../../vitest.config';

export default mergeConfig(
  vitestRoot,
  defineConfig({
    test: {
      name: '@biorate/connector-mocks',
      environment: 'node',
    },
  })
);
