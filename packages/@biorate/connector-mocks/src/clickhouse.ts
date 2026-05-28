import { createMockable } from './factory';
import { FileSnapshotStore, SnapshotStore } from './snapshot-store';
import { ClickhouseMockOptions } from './interfaces';
import type { ConnectorLike } from './factory';

/**
 * @description
 * Clickhouse-specific mockable factory with sensible defaults.
 *
 * Creates a mockable ClickhouseConnector with:
 * - File-based snapshot storage (__snapshots__ directory)
 * - Auto-detected mode from CONNECTOR_MOCK_MODE env var
 * - Clickhouse method name normalization
 *
 * @example
 * ```typescript
 * import { mockClickhouse } from '@biorate/connector-mocks';
 *
 * // Record mode (real DB, save snapshots)
 * // CONNECTOR_MOCK_MODE=record vitest run
 * const connector = mockClickhouse(ClickhouseConnector);
 *
 * // Replay mode (from snapshots, no DB needed)
 * // CONNECTOR_MOCK_MODE=replay vitest run
 * const connector = mockClickhouse(ClickhouseConnector);
 * ```
 */
export function mockClickhouse<T extends ConnectorLike>(
  ConnectorClass: new () => T,
  options?: ClickhouseMockOptions,
): T {
  return createMockable(new ConnectorClass(), {
    ...options,
    snapshotStore:
      options?.snapshotStore ??
      new FileSnapshotStore({
        snapshotsDir: '__snapshots__',
        fileExtension: '.mocks.json',
      }),
  });
}

/**
 * @description
 * Clickhouse-specific instance mockable factory.
 *
 * Use when you already have a connector instance.
 *
 * @example
 * ```typescript
 * import { mockClickhouseInstance } from '@biorate/connector-mocks';
 *
 * const connector = new ClickhouseConnector();
 * const mockable = mockClickhouseInstance(connector);
 * ```
 */
export function mockClickhouseInstance<T extends ConnectorLike>(
  connector: T,
  options?: ClickhouseMockOptions,
): T {
  return createMockable(connector, {
    ...options,
    snapshotStore:
      options?.snapshotStore ??
      new FileSnapshotStore({
        snapshotsDir: '__snapshots__',
        fileExtension: '.mocks.json',
      }),
  });
}

/**
 * @description
 * Helper for creating targeted Clickhouse method mocks.
 *
 * Use for fine-grained control over specific queries.
 *
 * @example
 * ```typescript
 * import { mockClickhouseWith } from '@biorate/connector-mocks';
 *
 * const connector = mockClickhouseWith(ClickhouseConnector, {
 *   methods: ['query', 'insert'],
 *   debug: true, // Log mock hits/misses
 * });
 * ```
 */
export function mockClickhouseWith<T extends ConnectorLike>(
  ConnectorClass: new () => T,
  options: {
    methods?: ('query' | 'insert' | 'exec' | 'ping')[];
    debug?: boolean;
    snapshotStore?: SnapshotStore;
  },
): T {
  return createMockable(new ConnectorClass(), {
    methods: options.methods,
    debug: options.debug,
    snapshotStore:
      options.snapshotStore ??
      new FileSnapshotStore({
        snapshotsDir: '__snapshots__',
        fileExtension: '.mocks.json',
      }),
  });
}
