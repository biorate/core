import { requireCjs } from '@/require';

/** @description Migrations runner and type definitions. */
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
