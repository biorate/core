export { Mockable } from './mockable';
export { unwrapMockTarget } from './proxy';
export { configureUnimock, flushAllSnapshots, getSnapshotStore } from './snapshot-store';
export {
  DEFAULT_SNAPSHOT_DIR,
  isUnimockEnabled,
  isUnimockLive,
  isUnimockUpdate,
  resolveMode,
  resolveSnapshotDir,
} from './env';
export * from './errors';
export * from './interfaces';
export { defaultSerializers, opaqueHandleSerializer } from './default-serializers';
export {
  isReplayableSnapshotFile,
  resolveSnapshotFilePath,
  snapshotDirFromImportMeta,
} from './snapshot-path';

import { configureUnimock, flushAllSnapshots } from './snapshot-store';

/** @description Global helpers for snapshot persistence. */
export const Unimock = {
  flush: flushAllSnapshots,
  configure: configureUnimock,
};
