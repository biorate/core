import { requireCjs } from '@/require';

export * from './root';
export * from './types/migration';
export * from './types';

requireCjs(
  process.env.MIGRATIONS_CONFIG
    ? process.cwd() + process.env.MIGRATIONS_CONFIG
    : './default.config',
);
requireCjs(
  process.env.MIGRATIONS_ROOT ? process.cwd() + process.env.MIGRATIONS_ROOT : './root',
);
