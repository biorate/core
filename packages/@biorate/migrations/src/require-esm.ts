import { createRequire } from 'node:module';

/** @description Dynamically import an ESM module. */
// @ts-ignore
export const requireCjs = createRequire(import.meta.filename);
