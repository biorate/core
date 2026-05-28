export { Mockable } from './mockable';
export {
  configureUnimock,
  flushAllSnapshots,
  getSnapshotStore,
} from './snapshot-store';
export {
  isUnimockEnabled,
  isUnimockLive,
  isUnimockUpdate,
  resolveSnapshotDir,
} from './env';
export * from './errors';
export * from './interfaces';
export { defaultSerializers, opaqueHandleSerializer } from './default-serializers';

import { configureUnimock, flushAllSnapshots } from './snapshot-store';

/** @description Global helpers for snapshot persistence. */
export const Unimock = {
  flush: flushAllSnapshots,
  configure: configureUnimock,
};
