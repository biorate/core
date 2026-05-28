/** @description Serialized call result stored in a snapshot file. */
export type SnapshotResult =
  | { kind: 'void' }
  | { kind: 'primitive'; value: unknown }
  | { kind: 'ref'; ref: string };

/** @description Single recorded method call. */
export interface SnapshotCallEntry {
  args: unknown[];
  result: SnapshotResult;
}

/** @description On-disk snapshot format (one file per class). */
export interface SnapshotFile {
  version: 1;
  className: string;
  calls: Record<string, SnapshotCallEntry>;
}

/** @description Runtime mode resolved from env and snapshot presence. */
export type UnimockMode = 'record' | 'replay' | 'live';

/** @description Custom pack/unpack for values JSON cannot represent. */
export interface ISerializer {
  test(value: unknown): boolean;
  pack(value: unknown): unknown;
  unpack(value: unknown): unknown;
}

/** @description Options for {@link Mockable}. */
export interface MockableOptions {
  /** Absolute or relative path to snapshot file (default: `__snapshots__/<ClassName>.unimock.json`). */
  snapshot?: string;
  /** Directory for default snapshot path. */
  snapshotDir?: string;
  serializers?: ISerializer[];
}

/** @description Global unimock settings. */
export interface UnimockConfig {
  snapshotDir?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T;
