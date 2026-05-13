import { createRequire } from 'node:module';

// @ts-ignore
export const requireCjs = createRequire(import.meta.filename);
