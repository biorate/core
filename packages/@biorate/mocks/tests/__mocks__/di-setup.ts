import { container, Types } from '@biorate/inversion';

/**
 * @description DI test setup helper
 *
 * ### Usage:
 * ```ts
 * beforeEach(() => {
 *   container.snapshot();
 * });
 *
 * afterEach(() => {
 *   container.restore();
 * });
 * ```
 */

export { container, Types };
