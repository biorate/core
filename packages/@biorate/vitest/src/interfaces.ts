import { TestContext } from 'vitest';

export interface TestArgs extends TestContext {
  // Additional custom properties can be added via extend
}

export interface SuiteOptions {
  timeout?: number;
  retries?: number;
  mode?: 'default' | 'parallel' | 'serial';
}
