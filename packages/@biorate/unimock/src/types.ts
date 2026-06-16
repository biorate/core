export type Constructor<T = object> = new (...args: any[]) => T;

export type UnimockEnv = {
  UNIMOCK?: string;
  UNIMOCK_SNAPSHOT_DIR?: string;
  UNIMOCK_UPDATE?: string; // deprecated
  UNIMOCK_LIVE?: string; // deprecated
};

export type UnimockMode = 'off' | 'record' | 'replay' | 'auto';

export type SnapshotResult =
  | { ok: true; value: unknown }
  | { ok: false; error: unknown };

export interface SnapshotCallEntry {
  key: string;
  path: string;
  args: unknown[];
  result: SnapshotResult;
}

export interface SnapshotFile {
  version: 1;
  calls: SnapshotCallEntry[];
}

export interface ISerializer {
  readonly name: string;
  test(value: unknown): boolean;
  serialize(value: unknown): unknown;
}

export interface UnimockConfig {
  snapshotDir: string;
  mode: UnimockMode;
  serializers: readonly ISerializer[];
}

export interface MockableOptions {
  /**
   * Override snapshot file prefix. By default uses the decorated class name.
   */
  snapshotName?: string;
}
