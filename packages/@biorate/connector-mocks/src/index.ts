/**
 * @description
 * Connector mocking library with snapshot-based testing.
 *
 * Provides factories for automatic interception of connector methods,
 * recording call args/results to snapshots, and replaying from snapshots.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { createMockable, FileSnapshotStore } from '@biorate/connector-mocks';
 *
 * // Recommended: Using factory
 * const connector = createMockable(new ClickhouseConnector());
 *
 * // Clickhouse-specific helper
 * import { mockClickhouse } from '@biorate/connector-mocks';
 * const connector = mockClickhouse(ClickhouseConnector);
 * ```
 *
 * ## Modes
 *
 * - **record** (default): Execute real methods, save snapshots to `__snapshots__/*.mocks.json`
 * - **replay**: Load from snapshots, no database required
 * - **passthrough**: No mocking, direct calls
 *
 * Set mode via environment variable:
 * ```bash
 * CONNECTOR_MOCK_MODE=replay vitest run
 * ```
 *
 * @packageDocumentation
 */

export * from './mockable';
export * from './factory';
export * from './snapshot-store';
export * from './interfaces';
export * from './errors';

// Clickhouse-specific exports
export { mockClickhouse, mockClickhouseInstance, mockClickhouseWith } from './clickhouse';
export type { ClickhouseMockOptions, ClickhouseMethod } from './interfaces';
