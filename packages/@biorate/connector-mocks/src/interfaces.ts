import { SnapshotStore } from './snapshot-store';

export interface MockableOptions {
  namespace?: string;
  snapshotStore?: SnapshotStore;
  debug?: boolean;
  transformArgs?: (args: any[], methodName: string) => any[];
  transformResult?: (result: any, methodName: string) => any;
}
