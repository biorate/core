import type { Logger } from './logger';
import type { Helpers, Transforms } from './helpers-ns';
import type { Prompter } from './prompter';
import type { ProjectHooks } from './hooks';

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
   *
   * A factory is invoked for every template render (frontmatter attributes and
   * body) with that action's locals, and lazily once per run (from the CLI
   * arguments, positionals under `_`) when lifecycle hooks or a class `prompt`
   * section read `h`. It must be re-entrant and must not depend on per-template
   * or prompt-provided values.
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
  /**
   * @description Controls how CLI flag keys are normalized before they become
   * template locals and hook `args` keys. `'keep'` (the default) preserves flag
   * keys exactly as parsed; `'upper-underscore'` normalizes hyphenated and
   * camel-cased keys to `UPPER_UNDERSCORE` form. Reserved keys (`_`, `ts`,
   * `name`, `generator`, `action`) are never normalized. */
  argCase?: 'keep' | 'upper-underscore';
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
