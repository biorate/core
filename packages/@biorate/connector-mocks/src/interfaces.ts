import { SnapshotStore } from './snapshot-store';

/**
 * @description Mock mode: record (real DB), replay (from snapshots), or passthrough
 */
export type MockMode = 'record' | 'replay' | 'passthrough';

/**
 * @description Environment variable names for mode detection
 */
export const MOCK_ENV_VARS = [
  'CONNECTOR_MOCK_MODE',
  'VITEST_MOCK_MODE',
  'TEST_MOCK_MODE',
  'MOCK_MODE',
] as const;

/**
 * @description Mode detection result with source information
 */
export interface ModeDetectionResult {
  mode: MockMode;
  source: string;
  isDefault: boolean;
}

/**
 * @description Options for Mockable decorator and factory
 */
export interface MockableOptions {
  /**
   * @description Namespace for snapshot keys (default: connector namespace)
   */
  namespace?: string;

  /**
   * @description Mock mode (default: auto-detect from env vars)
   */
  mode?: MockMode;

  /**
   * @description Custom snapshot store (default: FileSnapshotStore)
   */
  snapshotStore?: SnapshotStore;

  /**
   * @description Methods to intercept (default: all methods)
   */
  methods?: string[];

  /**
   * @description Enable verbose logging (default: false)
   */
  debug?: boolean;

  /**
   * @description Transform function for args before snapshot (for sanitizing)
   */
  transformArgs?: (args: any[], methodName: string) => any[];

  /**
   * @description Transform function for result before snapshot (for sanitizing)
   */
  transformResult?: (result: any, methodName: string) => any;
}

/**
 * @description Factory function options
 */
export interface FactoryOptions extends MockableOptions {
  /**
   * @description Explicit mode override
   */
  mode?: MockMode;
}

/**
 * @description Clickhouse-specific method names for targeted mocking
 */
export type ClickhouseMethod =
  | 'query'
  | 'insert'
  | 'insertValues'
  | 'insertStreaming'
  | 'exec'
  | 'command'
  | 'ping';

/**
 * @description Clickhouse-specific mock options
 *
 * Extends MockableOptions with Clickhouse-specific method filtering.
 */
export interface ClickhouseMockOptions extends Omit<MockableOptions, 'methods'> {
  /**
   * @description Specific Clickhouse methods to mock (default: all)
   */
  methods?: ClickhouseMethod[];
}
