export const MODE_RECORD = 'record';
export const MODE_REPLAY = 'replay';
export const MODE_OFF = 'off';

export const T_REF = 'ref';
export const T_ERROR = 'error';
export const T_CALLBACK = 'callback';
export const T_UNDEFINED = 'undefined';
export const T_NULL = 'null';
export const T_BOOLEAN = 'boolean';
export const T_NUMBER = 'number';
export const T_STRING = 'string';
export const T_POOLED_STRING = 'pooled_string';
export const T_BIGINT = 'bigint';
export const T_DATE = 'date';
export const T_REGEXP = 'regexp';
export const T_BUFFER = 'buffer';
export const T_ARRAY = 'array';
export const T_OBJECT = 'object';

export const PROP_CONSTRUCTOR = 'constructor';
export const PROP_THEN = 'then';
export const PROP_UNIMOCK_REF = '__unimock_ref__';
export const PROP_PRIVATE_PREFIX = '#';

export const PREFIX_CONN = 'conn:';
export const PREFIX_CONN_PROP = 'conn_prop:';
export const PREFIX_OBJ = 'obj_';
export const PREFIX_CB = 'cb_';
export const SEPARATOR_STORE = '::';

export const MARKER_CALLBACK = '<callback>';
export const MARKER_FUNCTION = '<function>';
export const MARKER_SYMBOL = '<symbol>';

export const HASH_ALGORITHM = 'md5';
export const HASH_ENCODING = 'hex';
export const ENCODING_BASE64 = 'base64';

export const COUNTER_INIT = 0;

export const SNAPSHOT_FILE_VERSION = 1;

export const DEFAULT_SNAPSHOT_DIR = 'tests/__snapshots__';
/** @description Snapshot file extension. Override via `SNAPSHOT_EXT` env (default: `.snap`). Format: `{className}.unimock{ext}`. */
export const DEFAULT_SNAPSHOT_EXT = process.env.SNAPSHOT_EXT ?? '.snap';

export const STABLE_HASH_LENGTH = 8;

export const STATIC_SAFE = new Set([
  'sync',
  'drop',
  'create',
  'findOne',
  'findAll',
  'findByPk',
  'findOrCreate',
  'findOrBuild',
  'findCreateFind',
  'findAndCountAll',
  'destroy',
  'update',
  'upsert',
  'bulkCreate',
  'truncate',
  'restore',
  'count',
  'sum',
  'min',
  'max',
  'increment',
  'decrement',
  'describe',
  'scope',
  'unscoped',
  'schema',
  'getTableName',
  'addScope',
  'removeAttribute',
  'getAttributes',
  'hasAlias',
  'hasMany',
  'belongsToMany',
  'hasOne',
  'belongsTo',
  'build',
  'bulkBuild',
  'warnOnInvalidOptions',
]);
