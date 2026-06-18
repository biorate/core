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
export { serialize, deserialize, stableHash, makeCallKey } from './serializer';

/** @description Snapshot store — per-class persistence of recorded calls. */
export {
  SnapshotStore,
  getSnapshotStore,
  flushAllSnapshots,
  isReplay,
  isRecord,
} from './snapshot-store';

/** @description Proxy wrapper for objects returned by mocked methods. */
export { MockHandler } from './mock-handler';

/** @description Universal noop proxy — any property, method, call, construct returns itself. */
export { noop } from './noop';

import { flushAllSnapshots, isReplay, isRecord } from './snapshot-store';
import { parseUnimockMode, resolveSnapshotDir } from './env';

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
  /** @description Current operating mode (from `UNIMOCK` env). */
  get mode() {
    return parseUnimockMode();
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
