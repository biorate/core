/**
 * @description Minimal output-printing surface that the runner uses to report
 * progress, warnings and errors. An implementation may wrap `console.log`, a
 * logger library, or some sink that accepts a single string per call. */
export interface Logger {
  /** @description Print a success/progress message. */
  ok: (msg: string) => void;
  /** @description Print an informational (magenta) notice. */
  notice: (msg: string) => void;
  /** @description Print a yellow warning. */
  warn: (msg: string) => void;
  /** @description Print a red error. */
  err: (msg: string) => void;
  /** @description Print a plain message (no color coding). */
  log: (msg: string) => void;
  /** @description Interpolate `chalk` tags embedded in a message and print it. */
  colorful: (msg: string) => void;
}

/**
 * @description A question/answer interaction used by template prompt hooks.
 * `Q` is the prompt/question shape and `T` the resolved answer shape. */
export interface Prompter<Q, T> {
  /** @description Ask a single prompt and resolve with the answer. */
  prompt: (arg0: Q) => Promise<T>;
}

/**
 * @description A single template action after frontmatter and body have been
 * rendered by EJS. This is the unit that operations (`add`, `inject`, `shell`,
 * …) consume and turn into concrete filesystem/shell effects. */
export interface RenderedAction {
  /** @description Absolute path of the source template file (when written from disk). */
  file?: string;
  /** @description Rendered frontmatter attributes; user-defined and unconstrained by shape. */
  attributes: Record<string, unknown>;
  /** @description Rendered template body (the file content / operation payload). */
  body: string;
}

/**
 * @description A callable helper exposed to templates through the `h` context
 * value. Accepts arbitrary arguments and returns an arbitrary value. */
export type Helper = (...args: unknown[]) => unknown;

/** @description A map of helper name to helper function. */
export type Helpers = Record<string, Helper>;

/**
 * @description The configuration object that drives `runner()`. It wires the
 * engine to concrete filesystem, logger and prompt implementations so the
 * library stays transport-agnostic. */
export interface RunnerConfig {
  /** @description Execute a shell command (`sh`) with a body (`body`). */
  exec: (sh: string, body: string) => void;
  /** @description Default templates directory (resolved relative to `cwd` when relative). */
  templates?: string;
  /** @description Absolute templates directory overriding all other resolution. */
  templatesOverride?: string;
  /** @description Current working directory used to resolve relative paths. */
  cwd: string;
  /** @description Logger implementation used for all output. */
  logger: Logger;
  /** @description Enable verbose debug output on error. */
  debug?: boolean;
  /**
   * @description Extra helpers merged with the built-in ones. Either a plain
   * map, or a factory receiving the (pre-merge) locals and a subset of the
   * runner configuration so helpers can be computed from context.
   * */
  helpers?:
    | Helpers
    | ((locals: Record<string, unknown>, config: RunnerContextConfig) => Helpers);
  /** @description Default local template values applied before CLI-supplied ones. */
  localsDefaults?: Record<string, unknown>;
  /** @description Factory that creates a `Prompter` for the given prompt/answer shapes. */
  createPrompter: <Q, T>() => Prompter<Q, T>;
  /**
   * @description Migration escape for embedders: when `true`, the removed `--name`
   * flag is accepted again, behaving as the pre-removal name source (a single value
   * works as one name; a repeated flag keeps its pre-removal array behavior). Use only
   * during migration — new integrations should pass the name positionally. */
  legacyNameFlag?: boolean;
}

/**
 * @description A subset of `RunnerConfig` that user-supplied `helpers` may receive
 * when context is built without a fully resolved runner configuration. */
export type RunnerContextConfig = Partial<RunnerConfig>;

/**
 * @description I/O primitives used by the config resolver to find and load the
 * nearest config file from the config-file family (`.hygen.js`, `.hygen.cjs`,
 * `.hygen.mjs`, `.hygen.ts`) relative to a directory. */
export interface ResolverIO {
  /** @description Whether a config file exists at the given path. */
  exists: (arg0: string) => Promise<boolean>;
  /** @description Load and return the config at the given path (parsed as plain data). */
  load: (arg0: string) => Promise<Record<string, unknown>>;
  /** @description Fallback config when no config file was found for the given directory. */
  none: (arg0: string) => Record<string, unknown>;
}

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
  /** @description Set when the run failed: the error message and the actions available. */
  failure?: {
    message: string;
    availableActions: string[];
  };
  /** @description Set for a `--keep-going` run that hit failures: one entry per
   *  failed pair, alongside the partial `actions` that did complete. */
  failures?: RunFailure[];
}

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
