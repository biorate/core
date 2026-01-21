import { rm } from 'fs/promises';
import { glob } from 'glob';
export * from './errors';
export * from './interfaces';

/**
 * @description Cleanup files and directories
 *
 * ### Features:
 * - Platform independent script for cleanup dirs and files
 *
 * @example
 * ```
 * ```
 */
export async function cleanup(...paths: string[]) {
  for (const path of await glob(paths)) await rm(path, { recursive: true, force: true });
}
