/**
 * @description Decorator — wraps a class to intercept method calls for recording or replaying.
 *   See {@link Mockable} for details.
 */
export { Mockable, mock } from './mockable';

/** @description Mode constants: `'record'`, `'replay'`, `'off'`. */
export { MODE_RECORD, MODE_REPLAY, MODE_OFF } from './constants';

/** @description Sequelize Model static method names for {@link MockableOptions.statics}. */
export { SEQUELIZE_STATICS } from './constants';

/** @description Error classes. */
export { UnimockReplayMissError, UnimockSerializeError } from './errors';

/** @description Environment variable parsers. */
export { parseUnimockMode, resolveSnapshotDir } from './env';

/** @description Serialiser/deserialiser and call key utilities. */
export {
  serialize,
  deserialize,
  stableHash,
  stableStringify,
  makeCallKey,
} from './serializer';

/** @description Snapshot store — per-class persistence of recorded calls. */
export {
  SnapshotStore,
  getSnapshotStore,
  flushAllSnapshots,
  releaseSnapshotStore,
  resetSnapshotStores,
  isReplay,
  isRecord,
} from './snapshot-store';

/** @description Proxy wrapper for objects returned by mocked methods. */
export { MockHandler } from './mock-handler';

/** @description Universal noop proxy — any property, method, call, construct returns itself. */
export { noop } from './noop';

/** @description Sequelize model risk-free binding helper for replay test setup (offline, no I/O). */
export { bindReplaySequelizeModels } from './sequelize';
export type { SequelizeOptions } from '@biorate/sequelize';

import {
  flushAllSnapshots,
  releaseSnapshotStore,
  resetSnapshotStores,
  isReplay,
  isRecord,
  SnapshotStore,
} from './snapshot-store';
import { resolveSnapshotDir } from './env';

/**
 * @description Convenience namespace bundling the most common Unimock utilities.
 *
 * @example
 * ```ts
 * import { Unimock } from '@biorate/unimock';
 *
 * console.log(Unimock.mode); // 'off' | 'record' | 'replay'
 * Unimock.flush(); // flush all snapshots
 * ```
 */
export const Unimock = {
  /** @description Flushes all dirty snapshot stores to disk. */
  flush: flushAllSnapshots,
  /**
   * @description Releases a single snapshot store's in-memory data by class name. No-op
   *   when `className` is absent or no store is registered. Call between host test files to
   *   bound memory in a long-running worker (e.g. vitest `isolate: false`).
   */
  release: releaseSnapshotStore,
  /** @description Releases all snapshot stores' in-memory data (clears the registry). */
  resetStores: resetSnapshotStores,
  /**
   * @description Current operating mode. Reads the mutating {@link SnapshotStore.mode}
   *   (tracked by `setMode`), so it stays consistent with {@link Unimock.isRecord} /
   *   {@link Unimock.isReplay} after a runtime mode switch — unlike a static parse of the
   *   `UNIMOCK` env var.
   */
  get mode() {
    return SnapshotStore.mode;
  },
  /** @description Whether current mode is `'record'`. */
  get isRecord() {
    return isRecord();
  },
  /** @description Whether current mode is `'replay'`. */
  get isReplay() {
    return isReplay();
  },
  /** @description Resolved snapshot directory path. */
  get snapshotDir() {
    return resolveSnapshotDir();
  },
};

export type {
  UnimockMode,
  MockableOptions,
  SerializedValue,
  SnapshotCall,
  SnapshotFile,
} from './interfaces';
