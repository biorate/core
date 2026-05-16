import { APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * @description Playwright test arguments passed to every test callback.
 */
export type TestArgs = {
  page: Page;
  context: BrowserContext;
  browser: Browser;
  browserName: string;
  request: APIRequestContext;
};
