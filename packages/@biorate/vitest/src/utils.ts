import { TestContext } from 'vitest';

/**
 * Wrap a hook function with proper context handling
 * @param callback - Hook callback function
 * @returns Wrapped hook function
 */
export const wrapHook =
  (callback: (context: TestContext) => void | Promise<void>) => (context: TestContext) =>
    callback(context);
