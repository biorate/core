import { TestContext } from 'vitest';
import type { ValidatorOptions } from 'class-validator';

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

/**
 * Validator options for schema validation
 */
export interface IValidatorOptions {
  schema: any;
  data?: any;
  field?: string;
  array?: boolean;
  validatorOptions?: ValidatorOptions;
  catch?: (e: Error) => boolean;
}
