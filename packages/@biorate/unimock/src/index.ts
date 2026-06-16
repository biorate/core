export { Mockable } from './mockable';
export { UnimockReplayMissError, UnimockSerializeError } from './errors';
export { parseUnimockMode, resolveSnapshotDir } from './env';
export { serialize, deserialize, stableHash, makeCallKey } from './serializer';
export { SnapshotStore, getSnapshotStore, flushAllSnapshots } from './snapshot-store';
export { ConnectionHandler } from './connection-proxy';

import { flushAllSnapshots } from './snapshot-store';
import { parseUnimockMode, resolveSnapshotDir } from './env';

export const Unimock = {
  flush: flushAllSnapshots,
  get mode() {
    return parseUnimockMode();
  },
  get snapshotDir() {
    return resolveSnapshotDir();
  },
};

export type { UnimockMode, MockableOptions, SerializedValue, SnapshotCall, SnapshotFile } from './interfaces';
