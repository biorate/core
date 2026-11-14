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
 * @description The rendered frontmatter attributes of a template action. Most
 * keys are user-defined and unconstrained (anything written in the frontmatter
 * block is preserved); the well-known keys below are documented so templates and
 * operations can rely on their semantics. Global attributes are declared on the
 * template frontmatter and drive a single action; glob attributes declare a
 * batch action that expands into one action per matched file.
 */
export interface ActionAttributes {
  /** @description Write target path, relative to `cwd` (overwrite is the default). */
  to?: string;
  /** @description Opt-in mirroring: derive the target from the template file path. */
  mirror?: boolean;
  /** @description A shell command to run instead of writing a file. */
  sh?: string;
  /** @description Glob pattern, relative to the template's own directory. Declaring
   *  it turns the template into a batch action: each matched file is rendered (in
   *  both its destination path and its content) and written to `to`/`destination`. */
  glob?: string;
  /** @description Path prefix stripped from each matched file's relative path when
   *  computing its destination (for glob batch actions). */
  base?: string;
  /** @description Extension suffixes removed from each matched file's file name when
   *  computing its destination (for glob batch actions). One or more suffix strings,
   *  e.g. `.t`, `.ejs.t`. */
  stripExtensions?: string | string[];
  /** @description Alias for `to`, the destination directory for glob batch actions
   *  (treated as a folder joined with each matched file's rendered relative path). */
  destination?: string;
  /** @description When the destination file already exists, skip the action instead of
   *  overwriting (or prompting to overwrite). */
  skipIfExists?: boolean;
  /** @description Template-rendered conditional skip. The rendered value is
   *  coerced: an empty string or a `false` spelling (case-insensitive, trimmed)
   *  runs the action; a `true` spelling skips it without a reason; any other
   *  non-empty string skips it and is reported as the skip reason. */
  skip?: unknown;
  /** @description Remaining attributes are user-defined and unconstrained by shape. */
  [key: string]: unknown;
}

/**
 * @description A single template action after frontmatter and body have been
 * rendered by EJS. This is the unit that operations (`add`, `inject`, `shell`,
 * …) consume and turn into concrete filesystem/shell effects. */
export interface RenderedAction {
  /** @description Absolute path of the source template file (when written from disk). */
  file?: string;
  /** @description Rendered frontmatter attributes; user-defined and unconstrained by shape. */
  attributes: ActionAttributes;
  /** @description Rendered template body (the file content / operation payload). */
  body: string;
  /** @description Set when the `skip:` attribute rendered truthy: `true` skips
   *  without a reason, while a non-`true` string is the skip reason reported in
   *  the run log. When present, no operation executes for this action. */
  skip?: true | string;
}

/**
 * @description A callable helper exposed to templates through the `h` context
 * value. Accepts arbitrary arguments and returns an arbitrary value. */
export type Helper = (...args: unknown[]) => unknown;

/**
 * @description A map of helper name to helper value, merged into the `h`
 * namespace. A value may be a callable (invocable in templates as
 * `h.name(args)`) or a scalar (usable as data in templates and resolvable by
 * `$IDENTIFIER$` path macros in mirrored targets). */
export type Helpers = Record<string, unknown>;

/**
 * @description A named content transform registered under `config.transforms`.
 * Receives the rendered content and the run locals used for rendering, and
 * returns the (possibly transformed) content. May be asynchronous. */
export type Transform = (
  content: string,
  locals: Record<string, unknown>,
) => string | Promise<string>;

/** @description A map of transform name to transform function. */
export type Transforms = Record<string, Transform>;

/**
 * @description The context handed to a lifecycle hook. Run-scoped hooks
 * (`project.beforeAll` / `project.afterAll`) receive `action: '*'` and no `name`
 * because they fire outside any concrete `(name, action)` pair.
 * */
export interface HookContext {
  /** @description Current working directory of the run. */
  cwd: string;
  /** @description Resolved templates root. */
  templates: string;
  /** @description Generator name of the run. */
  generator: string;
  /** @description Action as requested (`new` or `new:subaction`); `'*'` for run-scoped hooks. */
  action: string;
  /** @description Subaction when the action used the `action:subaction` form. */
  subaction?: string;
  /** @description Current name expansion, when the run used a name list. */
  name?: string;
  /** @description CLI-supplied arguments plus `name`, before prompt answers. */
  args: Record<string, unknown>;
  /** @description Resolved helper namespace: built-in helpers merged with project helpers. */
  h: Helpers;
  /** @description Logger used for all output. */
  logger: Logger;
  /** @description Whether the run is a `--dry` run. */
  dry: boolean;
}

/** @description A lifecycle hook body. May be asynchronous. */
export type HookMethod = (ctx: HookContext) => unknown | Promise<unknown>;

/**
 * @description Project-level lifecycle hooks, resolved from the optional `hooks`
 * object of the nearest `.hygen.*` configuration file. The same four methods
 * apply to every generator run; state, when needed, is held in the config module's
 * closure because the object itself is plain.
 * */
export interface ProjectHooks {
  /** @description Runs once before the run's pairs. */
  beforeAll?: HookMethod;
  /** @description Runs before the prompt phase of every `(name, action)` pair. */
  beforeEach?: HookMethod;
  /** @description Runs after the pair's execution with its operation outcomes. */
  afterEach?: (ctx: HookContext, results: ActionResult[]) => unknown | Promise<unknown>;
  /** @description Runs once after the run's pairs. */
  afterAll?: (ctx: HookContext, results: ActionResult[]) => unknown | Promise<unknown>;
}

/**
 * @description The action hook object: project-level lifecycle methods plus the
 * prompt section. A `hooks.*` module exports a class whose instance provides
 * these methods (so instance fields carry state across the run's pairs); a legacy
 * `prompt.*` / `index.*` module is adapted to the `prompt` method only, leaving
 * the lifecycle methods absent.
 * */
export interface ActionHooks extends ProjectHooks {
  /** @description Prompt section, called in place of the legacy prompting flow. */
  prompt?: (input: {
    /** @description Prompter factory result used for interactive questions. */
    prompter: Prompter<any, any>;
    /** @description CLI-supplied arguments and `name`. */
    args: Record<string, unknown>;
    /** @description Resolved helper namespace. */
    h: Helpers;
  }) => unknown;
}

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
  /**
   * @description Named content transforms applied to a template's rendered body
   * after rendering and before any operation runs (add, mirror write, inject).
   * Resolved from a template's `transform:` frontmatter attribute, which may
   * chain names with `|`. Each transform receives the current content and the
   * run locals, and may be async. A `transform:` on a shell-only action is
   * ignored with a warning. Registered exactly like `helpers` (a plain map). */
  transforms?: Transforms;
  /**
   * @description Project-level lifecycle hooks merged from the nearest `.hygen.*`
   * configuration file. They wrap every run of every generator; action-level
   * `hooks.*` methods compose inside them (`before*`: project → action,
   * `after*`: action → project). */
  hooks?: ProjectHooks;
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
  /**
   * @description Controls the interactive generator/action picker offered when the
   * CLI is invoked with zero positional arguments. `true` always runs the picker,
   * `false` disables it; when absent it auto-detects an interactive terminal
   * (`process.stdin.isTTY && process.stdout.isTTY`). Embedders that want the picker
   * under scripted control pass `interactive: true` and provide a prompter that can
   * answer the two select prompts. */
  interactive?: boolean;
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
