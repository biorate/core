/**
 * @description A single operation outcome produced by the runner. The shape is
 * intentionally open (user-defined keys), so values are `unknown`. When produced by
 * an expansion run the outcome is additionally annotated with the source `action`
 * and `name` of the pair that generated it.
 * */
export type ActionResult = Record<string, unknown> & {
  /** @description Source action (or comma-list element) that produced this outcome. */
  action?: string;
  /** @description Source name expansion that produced this outcome. */
  name?: string;
};

/**
 * @description Three-state outcome of an executed action. `ok` means the action
 * ran to completion, `skipped` means the `skip:` attribute was truthy so no
 * operation executed, `failed` means the action errored and was surfaced via
 * `RunnerResult.failures`. */
export type ActionStatus = 'ok' | 'skipped' | 'failed';

/**
 * @description Per-action three-state outcome recorded in `RunnerResult.statuses`.
 * One entry is produced per rendered action (including skipped ones, which produce
 * no operation result). A skipped entry carries the `skip:` reason when the
 * attribute rendered to a non-`true` message string. Skipped entries never appear
 * in `RunnerResult.failures`. */
export interface ActionStatusEntry {
  /** @description The action (or comma-list element) that produced this outcome. */
  action: string;
  /** @description The name expansion, when the run used name lists. */
  name?: string;
  /** @description The three-state outcome of the action. */
  status: ActionStatus;
  /** @description The skip reason, present only when `status` is `skipped`. */
  reason?: string;
}

/**
 * @description A single failed `(name, action)` pair recorded during a
 * `--keep-going` run. `name` is absent when the run expanded no name list. */
export interface RunFailure {
  /** @description The action (or comma-list element) that failed. */
  action: string;
  /** @description The name expansion that failed, when the run used name lists. */
  name?: string;
  /** @description The error message reported for the failing pair. */
  error: string;
}

/**
 * @description The result returned by `runner()`. `actions` holds every
 * operation outcome; `failure` is present only when the run failed. */
export interface RunnerResult {
  /** @description Whether the whole run succeeded (no unhandled error). */
  success: boolean;
  /** @description Wall-clock time the run took, in milliseconds. */
  time: number;
  /** @description One outcome entry per executed operation. */
  actions: ActionResult[];
  /**
   * @description Per-action three-state outcome alongside `actions`: one entry
   * per rendered action in the `ok` / `skipped` three-state model, including
   * skipped actions (which produce no operation result and therefore no
   * `actions` entry). Failed actions surface through `failures`; skipped actions
   * never do. */
  statuses: ActionStatusEntry[];
  /** @description Set when the run failed: the error message and the actions available. */
  failure?: {
    message: string;
    availableActions: string[];
  };
  /** @description Set for a `--keep-going` run that hit failures: one entry per
   *  failed pair, alongside the partial `actions` that did complete. */
  failures?: RunFailure[];
}
