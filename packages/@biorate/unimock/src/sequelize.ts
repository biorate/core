import { ModelCtor, Sequelize, type SequelizeOptions } from '@biorate/sequelize';
import { MODE_OFF } from './constants';
import { fallbackOnMissEnabled } from './env';
import { isReplay, SnapshotStore } from './snapshot-store';
import { registerReplayFallback } from './state';

/**
 * @description Marker set on a connection manager patched for offline replay. Guards against
 *   double-patching when `bindReplaySequelizeModels` runs more than once per process.
 */
const OFFLINE_CONNECTION_MARKER = '__unimock_offline_connection__';

/**
 * @description Minimal structural shape of the Sequelize connection manager methods that
 *   route into real I/O. Any call reaching these during replay must terminate offline.
 */
type ConnectionManagerLike = {
  getConnection(...args: unknown[]): unknown;
  releaseConnection(...args: unknown[]): unknown;
  resetConnection(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  destroyConnection(...args: unknown[]): unknown;
  close(...args: unknown[]): unknown;
};

type QueryCallback = (e: Error | null, r: object) => void;

/**
 * @description Creates an inert in-memory connection that accepts Sequelize calls without
 *   touching the network. Every query resolves to an empty postgres-shaped result
 *   (`{ command: 'SELECT', rowCount: 0, rows: [], fields: [] }`). Supports both callback and
 *   promise invocation styles (the raw pg Client surface used by Sequelize).
 */
function makeOfflineConnection() {
  const result = () => ({ command: 'SELECT', rowCount: 0, rows: [], fields: [] });
  return {
    query(_sql: unknown, a: unknown, b: unknown) {
      let cb: QueryCallback | null = null;
      if (typeof a === 'function') cb = a as QueryCallback;
      else if (typeof b === 'function') cb = b as QueryCallback;
      if (cb) {
        queueMicrotask(() => cb(null, result()));
        return undefined;
      }
      return Promise.resolve(result());
    },
  };
}

/**
 * @description Replaces the real connection manager of a Sequelize instance so that ANY code
 *   path executing raw library code on it (e.g. `Model.sequelize?.query(...)`, `authenticate()`,
 *   direct `transaction()`) terminates offline instead of opening a live connection during
 *   replay. The patch is instance-level (never touches the class prototype) and idempotent.
 *
 *   Skipped when `UNIMOCK_FALLBACK_ON_MISS=1` — in that mode the fallback must stay live so the
 *   replay-miss handler can execute unrecorded methods against the real backend.
 */
function makeConnectionManagerOffline(connection: unknown): void {
  const cm = (connection as { connectionManager?: ConnectionManagerLike | null })
    ?.connectionManager as ConnectionManagerLike | null | undefined;
  if (!cm || (cm as unknown as Record<string, unknown>)[OFFLINE_CONNECTION_MARKER])
    return;
  const offline = makeOfflineConnection();
  cm.getConnection = async () => offline;
  cm.releaseConnection = () => undefined;
  cm.resetConnection = () => undefined;
  cm.disconnect = () => undefined;
  cm.destroyConnection = () => undefined;
  cm.close = async () => undefined;
  Object.defineProperty(cm, OFFLINE_CONNECTION_MARKER, { value: true });
}

/**
 * @description Test-setup helper that binds Sequelize models to an OFFLINE `Sequelize`
 *   instance in replay mode — the constructor performs no I/O, so no live DB is required.
 *
 *   Why: in replay the original `connect()` is replayed from the snapshot, so the model is
 *   never bound to a `Sequelize` instance and its `isInitialized` flag stays `false` — the
 *   original static `build()` would throw `ModelNotInitializedError` during replay
 *   reconstruction (see {@link rebuildInstance}).
 *
 *   The binding runs with the global mode temporarily switched to `'off'` and restored
 *   afterwards, because `Model.init()` internally invokes wrapped statics (e.g.
 *   `getTableName`) which must NOT route into a replay lookup during setup.
 *
 *   In replay the created instance is additionally made hermetic: its connection manager is
 *   replaced with an offline stub (see {@link makeConnectionManagerOffline}), so any stray
 *   raw call through the real library code (e.g. `Model.sequelize?.query('SELECT setval(...)')`)
 *   never opens a live connection. This makes replay fully DB-less. When
 *   `UNIMOCK_FALLBACK_ON_MISS=1` the connection manager is left live so the replay-miss
 *   fallback can execute against the real backend.
 *
 *   No-op (returns `undefined`) outside replay mode.
 *
 * @example
 * ```ts
 * import { bindReplaySequelizeModels } from '@biorate/unimock';
 *
 * beforeAll(async () => {
 *   // offline-биндинг, без I/O; вернёт undefined вне replay
 *   bindReplaySequelizeModels(TestModel, OtherModel);
 * });
 * ```
 */
export function bindReplaySequelizeModels(...args: (ModelCtor | SequelizeOptions)[]) {
  if (!isReplay()) return;
  const last = args[args.length - 1];
  const hasOptions = typeof last === 'object' && last !== null && !Array.isArray(last);
  const models = hasOptions ? (args.slice(0, -1) as ModelCtor[]) : (args as ModelCtor[]);
  const options = (hasOptions ? last : {}) as SequelizeOptions;
  const prev = SnapshotStore.mode;
  SnapshotStore.setMode(MODE_OFF);
  try {
    const connection = new Sequelize({
      dialect: 'postgres',
      logging: false,
      ...options,
      models,
    });
    if (!fallbackOnMissEnabled()) makeConnectionManagerOffline(connection);
    registerReplayFallback('Sequelize', connection);
    return connection;
  } finally {
    SnapshotStore.setMode(prev);
  }
}
