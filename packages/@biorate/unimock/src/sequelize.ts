import { ModelCtor, Sequelize, type SequelizeOptions } from '@biorate/sequelize';
import { MODE_OFF } from './constants';
import { isReplay, SnapshotStore } from './snapshot-store';

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
    return new Sequelize({
      dialect: 'postgres',
      logging: false,
      ...options,
      models,
    });
  } finally {
    SnapshotStore.setMode(prev);
  }
}
