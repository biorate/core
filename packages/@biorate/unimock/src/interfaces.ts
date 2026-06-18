/** @description Unimock operational mode. */
export type UnimockMode = 'off' | 'record' | 'replay';

/** @description Options for the {@link Mockable} decorator. */
export interface MockableOptions {
  /** @description Override snapshot directory (default: `__snapshots__` relative to the calling
   *   test file when `importMeta` is provided, otherwise `tests/__snapshots__`). */
  snapshotDir?: string;
  /** @description Pass `import.meta` from the calling test module to resolve the snapshot
   *   directory relative to the test file: `__snapshots__/` alongside the test.
   *   When provided, `snapshotDir` is ignored. */
  importMeta?: ImportMeta;
  /**
   * @description Static method wrapping configuration. Each element is a list of method names.
   *   Predefined lists like {@link SEQUELIZE_STATICS} can be used directly.
   */
  statics?: string[][];
  /**
   * @description Enable serialization of symbol values (default: `false`).
   *   When enabled, symbols are serialized as their description string and restored via `Symbol()`.
   *   Disabled by default to avoid breaking existing snapshots.
   */
  symbols?: boolean;
  /**
   * @description Maximum depth for recursive wrapping of nested results in
   *   a {@link MockHandler}. When the wrapping depth reaches this value,
   *   results are serialized directly instead of being wrapped.
   *   Default: `Infinity` (unlimited).
   */
  depth?: number;
}

/** @description Serialized primitive value (undefined, null, boolean, number, string, bigint). */
export interface SerializedPrimitive {
  t: 'undefined' | 'null' | 'boolean' | 'number' | 'string' | 'bigint';
  v?: unknown;
}

/** @description Serialized Date (ISO string). */
export interface SerializedDate {
  t: 'date';
  v: string;
}

/** @description Serialized RegExp (source + flags). */
export interface SerializedRegExp {
  t: 'regexp';
  v: { s: string; f: string };
}

/** @description Serialized Buffer (base64). */
export interface SerializedBuffer {
  t: 'buffer';
  v: string;
}

/** @description Serialized Error (name + message + optional stack). */
export interface SerializedError {
  t: 'error';
  v: { n: string; m: string; s?: string };
}

/** @description Reference to a {@link MockHandler} by its refId. */
export interface SerializedRef {
  t: 'ref';
  v: string;
}

/** @description Serialized callback recording — stores arguments of each invocation. */
export interface SerializedCallback {
  t: 'callback';
  v: { callRef: string; recording: unknown[][] };
}

/** @description Serialized array of nested {@link SerializedValue}s. */
export interface SerializedArray {
  t: 'array';
  v: SerializedValue[];
}

/**
 * @description Serialized plain object. Keys are sorted deterministically.
 *   Only enumerable own properties are included. Private `#`-prefixed keys are excluded.
 */
export interface SerializedObject {
  t: 'object';
  v: { k: string; v: SerializedValue }[];
}

/**
 * @description Reference to a pooled string. The actual value is stored in
 *   {@link SnapshotFile.strings} to avoid duplicating large strings across entries.
 */
export interface SerializedPooledString {
  t: 'pooled_string';
  v: string;
}

/** @description Serialized symbol (description stored as string). */
export interface SerializedSymbol {
  t: 'symbol';
  v: string;
}

/** @description Union of all serialized value types. */
export type SerializedValue =
  | SerializedPrimitive
  | SerializedDate
  | SerializedRegExp
  | SerializedBuffer
  | SerializedError
  | SerializedRef
  | SerializedCallback
  | SerializedSymbol
  | SerializedArray
  | SerializedObject
  | SerializedPooledString;

/** @description A single recorded call entry within a snapshot file. */
export interface SnapshotCall {
  /** @description Serialized call arguments (used for callback replay). */
  args: SerializedValue[];
  /** @description Serialized return value. */
  result: SerializedValue;
  /** @description Serialized error, if the call threw. */
  error?: SerializedValue;
}

/** @description On-disk snapshot file format. */
export interface SnapshotFile {
  /** @description Format version (currently `1`). */
  version: 1;
  /** @description Name of the mocked class. */
  className: string;
  /** @description Map of callKey → recorded entry. */
  calls: Record<string, SnapshotCall>;
  /**
   * @description Pooled strings referenced by {@link SerializedPooledString} entries.
   *   Only present when at least one large string was deduplicated.
   */
  strings?: Record<string, string>;
}

/** @description Minimal contract satisfied by {@link SnapshotStore}. */
export interface SnapshotStoreEntry {
  get(callKey: string): SnapshotCall | undefined;
  has(callKey: string): boolean;
  record(callKey: string, call: SnapshotCall): void;
  flush(): void;
  get mode(): UnimockMode;
}
