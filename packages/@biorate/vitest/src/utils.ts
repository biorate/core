import { TestContext } from 'vitest';

export const wrapHook =
  (callback: (context: TestContext) => void | Promise<void>) => (context: TestContext) =>
    callback(context);
