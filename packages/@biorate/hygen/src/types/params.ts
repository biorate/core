/**
 * @description The parsed CLI-facing shape for a run: positionals (generator,
 * action, subaction, name), the resolved templates directory, and extra
 * data options passed through. */
export type ParamsResult = {
  /** @description Resolved templates directory. */
  templates: string | undefined;
  /** @description Generator positional (e.g. `new`). */
  generator: string | undefined;
  /** @description Action positional or resolved `_default` action (legacy scalar; use `actions`). */
  action?: string;
  /** @description Sub-action after a `:` separator, when present. */
  subaction?: string;
  /** @description Absolute path of the action folder being run. */
  actionfolder?: string;
  /** @description The `--name` value, when supplied. */
  name?: string;
  /** @description Whether the run was performed in `--dry` mode. */
  dry?: boolean;
  /** @description The comma-split action list for this run (single run = one element). */
  actions?: string[];
  /** @description The comma-split name list for this run (absent when no name supplied). */
  names?: string[];
  /** @description The CLI data options (yargs-parser output minus `_`), used to drive the per-pair prompt filter. */
  cleanArgv?: Record<string, unknown>;
  /** @description The CLI positional arguments (yargs-parser `_` output). */
  _?: (string | number)[];
  /** @description A unique timestamp for the run (from `HYGEN_TS` when set). */
  ts?: string | number;
} & object;
