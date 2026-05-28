/**
 * Vitest integration for @biorate/unimock.
 *
 * @example
 * // vitest.config.ts
 * export default defineConfig({
 *   test: {
 *     setupFiles: ['@biorate/unimock/vitest/setup'],
 *   },
 * });
 */
export { flushAllSnapshots } from '../snapshot-store';
