import { getRequire } from '@biorate/node-tools';

export * from './root';
export * from './types/migration';
export * from './types';

const requireFn = getRequire();

requireFn(
  process.env.MIGRATIONS_CONFIG
    ? process.cwd() + process.env.MIGRATIONS_CONFIG
    : './default.config',
);
requireFn(
  process.env.MIGRATIONS_ROOT ? process.cwd() + process.env.MIGRATIONS_ROOT : './root',
);
