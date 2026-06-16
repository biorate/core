export type UnimockMode = 'off' | 'record' | 'replay';

export interface MockableOptions {
  snapshotDir?: string;
}

export interface SerializedPrimitive {
  t: 'undefined' | 'null' | 'boolean' | 'number' | 'string' | 'bigint';
  v?: unknown;
}

export interface SerializedDate {
  t: 'date';
  v: string;
}

export interface SerializedRegExp {
  t: 'regexp';
  v: { s: string; f: string };
}

export interface SerializedBuffer {
  t: 'buffer';
  v: string;
}

export interface SerializedError {
  t: 'error';
  v: { n: string; m: string; s?: string };
}

export interface SerializedRef {
  t: 'ref';
  v: string;
}

export interface SerializedCallback {
  t: 'callback';
  v: { callRef: string; recording: unknown[][] };
}

export interface SerializedArray {
  t: 'array';
  v: SerializedValue[];
}

export interface SerializedObject {
  t: 'object';
  v: { k: string; v: SerializedValue }[];
}

export type SerializedValue =
  | SerializedPrimitive
  | SerializedDate
  | SerializedRegExp
  | SerializedBuffer
  | SerializedError
  | SerializedRef
  | SerializedCallback
  | SerializedArray
  | SerializedObject;

export interface SnapshotCall {
  args: SerializedValue[];
  result: SerializedValue;
  error?: SerializedValue;
}

export interface SnapshotFile {
  version: 1;
  className: string;
  calls: Record<string, SnapshotCall>;
}

export interface SnapshotStoreEntry {
  get(callKey: string): SnapshotCall | undefined;
  has(callKey: string): boolean;
  record(callKey: string, call: SnapshotCall): void;
  flush(): void;
  get mode(): UnimockMode;
}
