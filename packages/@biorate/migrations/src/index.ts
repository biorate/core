import {container} from "@biorate/inversion";

export * from './root';
export * from './types/migration';
export * from './types';

require(process.env.MIGRATIONS_CONFIG
  ? process.cwd() + process.env.MIGRATIONS_CONFIG
  : './default.config');
require(process.env.MIGRATIONS_ROOT
  ? process.cwd() + process.env.MIGRATIONS_ROOT
  : './root');
