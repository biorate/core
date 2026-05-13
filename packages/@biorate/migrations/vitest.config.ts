import path from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestRoot from '../../../vitest.config';

/** Vitest does not apply tsconfig `paths`; `@/…` would otherwise resolve as an npm scope. */
export default mergeConfig(
  vitestRoot,
  defineConfig({
    resolve: {
      alias: {
        '@/require': path.resolve(process.cwd(), 'src/require-cjs.ts'),
      },
    },
    test: {
      environment: 'node',
    },
  }),
);
