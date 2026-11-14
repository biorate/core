import type { Logger } from './logger';
import type { Helpers } from './helpers-ns';
import type { Prompter } from './prompter';
import type { ActionResult } from './results';

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
  /**
   * @description Helper namespace: built-in helpers merged with project helpers.
   * Resolved lazily on first access, once per run, from the run's CLI arguments
   * (`_` positionals plus flags, no per-pair `name`) so a hook-less run never
   * invokes the config factory outside rendering. Reading, spreading or
   * serializing the whole context triggers resolution. */
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
    /** @description Helper namespace, resolved lazily on first read for class hooks. */
    h: Helpers;
  }) => unknown;
}

/** @description Which kind of hook module an action folder resolved to. */
export type HookKind = 'class' | 'legacy' | 'none';

/** @description The normalized result of action hook resolution. */
export interface ResolvedActionHooks {
  /** @description Lifecycle-capable object; lifecycle methods are absent for legacy/none. */
  instance: ActionHooks;
  /** @description Resolution kind. */
  kind: HookKind;
  /** @description Resolved hook file, when one was found. */
  file?: string;
  /** @description Raw legacy module (internal, used for the prompt dispatch). */
  source?: unknown;
  /** @description Validated `params` schema exported by a class hook module, when present. */
  params?: import('./params-schema').ParamsSchema;
}

/** @description Per-run cache of resolution promises, keyed by resolved action folder. */
export type HookCache = Map<string, Promise<ResolvedActionHooks>>;
