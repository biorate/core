/**
 * @description Shared module-level mutable state for the mockable pipeline.
 *
 *   Kept in its own module so the wrapper factory (`method-wrapper.ts`), static replay
 *   (`statics.ts`) and the decorator entry point (`mockable.ts`) reference the SAME
 *   instances (no duplicated WeakMaps / counters).
 */

/**
 * @description Instances constructed by {@link rebuildInstance} during replay. Only these
 *   are eligible for the replay-miss fallback: they are reconstructed locally from
 *   recorded data, so unrecorded instance methods (e.g. Sequelize attribute getters)
 *   can safely read their own state. Fresh user-constructed instances stay strict.
 */
export const replayRebuilt = new WeakSet<object>();

/**
 * @description Original (pre-wrap) implementations of wrapped static methods, keyed by class.
 *   Captured in `wrapStaticMethods` before `Object.defineProperty` replaces them.
 *   Replay reconstruction MUST use the original `build` — the wrapped one routes into a
 *   replay lookup for reconstruction args that were never recorded and would throw
 *   `UnimockReplayMissError`.
 */
export const staticOriginals = new WeakMap<
  object,
  Map<string, (...args: unknown[]) => unknown>
>();

/**
 * @description Depth counter of in-flight replay reconstructions (`rebuildInstance`).
 *   While `> 0`, wrapped instance methods and getters must NOT touch the snapshot store:
 *   during replay reconstruction the vanilla constructor re-enters wrapped prototype
 *   methods (e.g. Sequelize `_initValues`) with options that record mode never produced
 *   (recon `{ isNewRecord: false, _schema: null, _schemaDelimiter: '' }` vs hydration
 *   `{ raw: true, attributes: [...] }`), so a replay lookup would miss with
 *   `UnimockReplayMissError`. The call passes through to the original instead —
 *   instance state is populated by the model's own constructor; post-construction calls
 *   (`toJSON`/`get`/…) are served from the recorded `call:{refId}:` entries once
 *   `registerStaticRefs` binds the rebuilt instances under their recorded refIds.
 */
let reconstructionDepth = 0;

/** @description `true` when inside a `rebuildInstance` call (replay reconstruction). */
export function inReconstruction(): boolean {
  return reconstructionDepth > 0;
}

/** @description Runs `fn` with the reconstruction depth counter incremented. */
export function withReconstructionDepth<T>(fn: () => T): T {
  reconstructionDepth += 1;
  try {
    return fn();
  } finally {
    reconstructionDepth -= 1;
  }
}
