import type { TestContext } from 'vitest';

/**
 * Extended test context with custom properties
 */
export interface TestArgs extends TestContext {
  // Additional custom properties can be added via extend decorator
}

/**
 * Suite configuration options
 */
export interface SuiteOptions {
  /**
   * Execution mode: serial or parallel
   * @default undefined (uses Vitest default)
   */
  mode?: 'serial' | 'parallel';

  /**
   * Suite timeout in milliseconds
   * @default undefined (uses Vitest default)
   */
  timeout?: number;

  /**
   * Number of retries for failed tests
   * @default undefined (uses Vitest default)
   */
  retries?: number;
}

/**
 * Allure metadata storage type
 */
export type AllureMethod = string[] | string[][];

/**
 * Allure metadata record
 */
export interface AllureMetadata {
  [method: string]: AllureMethod;
}
