import { TestInfo } from '@playwright/test';
import { TestArgs } from '../interfaces';

export const wrapEach =
  (callback: (...args: any[]) => any | Promise<any>) =>
  ({ page, context, browser, browserName, request }: TestArgs, info: TestInfo) =>
    callback({ page, context, browser, browserName, request }, info);

export const wrapAll =
  (callback: (...args: any[]) => any | Promise<any>) =>
  ({ browser, browserName, request }: TestArgs, info: TestInfo) =>
    callback({ browser, browserName, request }, info);
