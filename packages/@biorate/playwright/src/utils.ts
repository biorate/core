import { TestInfo } from '@playwright/test';
import { TestArgs } from '../interfaces';

/**
 * @description Wraps a per-test lifecycle hook to receive Playwright test arguments.
 */
export const wrapEach =
  (callback: (...args: any[]) => any | Promise<any>) =>
  ({ page, context, browser, browserName, request }: TestArgs, info: TestInfo) =>
    callback({ page, context, browser, browserName, request }, info);

/**
 * @description Wraps a suite-level lifecycle hook to receive Playwright test arguments.
 */
export const wrapAll =
  (callback: (...args: any[]) => any | Promise<any>) =>
  ({ browser, browserName, request }: TestArgs, info: TestInfo) =>
    callback({ browser, browserName, request }, info);
