import { APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';

export type TestArgs = {
  page: Page;
  context: BrowserContext;
  browser: Browser;
  browserName: string;
  request: APIRequestContext;
};
