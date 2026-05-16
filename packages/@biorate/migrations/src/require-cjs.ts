import { createRequire } from 'node:module';

/** @description Require a CommonJS module. */
export const requireCjs = createRequire(__filename);
