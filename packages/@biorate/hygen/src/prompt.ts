import path from 'path';
import fs from 'fs';
import type { ActionHooks, Helpers, Prompter, ProjectHooks, RunnerConfig } from './types';
import helpers from './helpers';
import { pickableGenerators, generatorActions } from './help';
import { HookModuleError, HookTsNodeError } from './errors';

/** @description New class-based action hook files, highest priority first. */
export const ACTION_HOOK_FILES = ['hooks.ts', 'hooks.js', 'hooks.mjs', 'hooks.cjs'];

/** @description Legacy action hook files, kept for backward compatibility. */
export const LEGACY_HOOK_FILES = [
  'index.js',
  'index.ts',
  'prompt.cjs',
  'prompt.js',
  'prompt.ts',
];

/** @description All action hook candidates in resolution order. */
export const HOOK_FILES = [...ACTION_HOOK_FILES, ...LEGACY_HOOK_FILES];

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
}

/** @description Per-run cache of resolution promises, keyed by resolved action folder. */
export type HookCache = Map<string, Promise<ResolvedActionHooks>>;

const LIFECYCLE_METHODS = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'] as const;

/**
 * @description Imports a hook module, lazily registering `ts-node` for TypeScript
 * files exactly like the `.hygen.ts` config loader does.
 */
const loadHookModule = async (file: string): Promise<Record<string, unknown>> => {
  if (/\.ts$/.test(file)) {
    try {
      await import('ts-node/register/transpile-only');
    } catch (cause) {
      throw new HookTsNodeError(file, cause);
    }
  }
  return (await import(file)) as Record<string, unknown>;
};

/** @description Adapts a legacy hook module to the prompt-only hook contract. */
const legacyAdapter = (raw: any): ActionHooks => ({
  prompt: async ({ prompter, args }) => {
    if (raw?.params) return raw.params({ args, h: helpers });
    if (raw?.prompt) {
      return raw.prompt({ prompter, inquirer: prompter, args, h: helpers });
    }
    return prompter.prompt(
      raw.filter(
        (p: { name: string } & Record<string, any>) =>
          args[p.name] === undefined ||
          args[p.name] === null ||
          (args[p.name] as { length?: number } | undefined)?.length === 0,
      ),
    );
  },
});

const loadResolvedHooks = async (actionfolder: string): Promise<ResolvedActionHooks> => {
  const file = HOOK_FILES.map((f) => path.resolve(path.join(actionfolder, f))).find((f) =>
    fs.existsSync(f),
  );

  if (!file) return { instance: {}, kind: 'none' };

  const isClassFile = ACTION_HOOK_FILES.includes(path.basename(file));
  const module = await loadHookModule(file);

  if (!isClassFile) {
    const raw = (module.default as unknown) ?? module;
    return { instance: legacyAdapter(raw), kind: 'legacy', file, source: raw };
  }

  const exported = (module as { default?: unknown }).default;
  if (typeof exported !== 'function') {
    throw new HookModuleError(
      file,
      exported === undefined
        ? 'no default export'
        : `default export is ${typeof exported}`,
    );
  }

  try {
    return {
      instance: new (exported as new () => ActionHooks)(),
      kind: 'class',
      file,
    };
  } catch (cause) {
    throw new HookModuleError(
      file,
      `default export could not be constructed: ${(cause as Error)?.message ?? cause}`,
    );
  }
};

/**
 * @description Resolves the action folder's hook module, instantiating a
 * `hooks.*` class exactly once per cache key. The cache is scoped by the caller
 * (one `Map` per `engine()` run), so one instance serves every pair of the action
 * and instance fields carry state across pairs.
 * @param actionfolder - The action folder to inspect.
 * @param cache - Optional per-run resolution cache.
 * @returns The normalized hooks object, its kind and the resolution file.
 */
export const resolveActionHooks = (
  actionfolder: string,
  cache?: HookCache,
): Promise<ResolvedActionHooks> => {
  const key = path.resolve(actionfolder);
  if (!cache) return loadResolvedHooks(key);
  const cached = cache.get(key);
  if (cached) return cached;
  const pending = loadResolvedHooks(key);
  cache.set(key, pending);
  return pending;
};

/**
 * @description Keeps only function-valued lifecycle methods of a project hooks
 * object, warning about ignored entries. A missing or non-object value resolves
 * to an empty object so a malformed config degrades instead of failing the run.
 * @param hooks - The value merged from the `.hygen.*` configuration.
 * @param logger - Logger used to report ignored entries.
 * @returns The normalized project hooks.
 */
export const normalizeProjectHooks = (
  hooks: unknown,
  logger: RunnerConfig['logger'],
): ProjectHooks => {
  if (!hooks || typeof hooks !== 'object') return {};
  const normalized: ProjectHooks = {};
  for (const [key, value] of Object.entries(hooks as Record<string, unknown>)) {
    if (!(LIFECYCLE_METHODS as readonly string[]).includes(key)) {
      logger.warn(`Ignoring unknown project hook '${key}' in .hygen.* configuration.`);
      continue;
    }
    if (typeof value !== 'function') {
      logger.warn(
        `Ignoring non-function project hook '${key}' in .hygen.* configuration.`,
      );
      continue;
    }
    (normalized as Record<string, unknown>)[key] = value;
  }
  return normalized;
};

/**
 * @description Runs the prompt hook for an action folder (if present) or falls
 * back to prompting for any unknown/empty params via the prompter. TypeScript
 * hook files are transpiled on the fly with `ts-node`.
 * @param createPrompter - Factory producing the prompter to use.
 * @param actionfolder - The action folder to inspect for a prompt hook.
 * @param args - The CLI-supplied arguments used to skip already-provided params.
 * @param options - Optional lazy/explicit helpers and the per-run hook cache.
 * @returns The prompt answers (or the resolved hook params), an object when no hook/prompt applies.
 * */
const prompt = async <Q, T>(
  createPrompter: () => Prompter<Q, T>,
  actionfolder: string,
  args: Record<string, any>,
  options: { h?: Helpers | (() => Helpers); cache?: HookCache } = {},
): Promise<T | object> => {
  const resolved = await resolveActionHooks(actionfolder, options.cache);
  const legacy = resolved.source as
    | { params?: (input: { args: Record<string, any>; h: Helpers }) => unknown }
    | undefined;

  // legacy `params` short-circuits without a prompter, as before
  if (resolved.kind === 'legacy' && legacy?.params) {
    return legacy.params({ args, h: helpers }) as T;
  }
  if (!resolved.instance.prompt) return {};

  const prompter = createPrompter();
  const lazyHelpers = options.h;
  return resolved.instance.prompt({
    prompter,
    args,
    // Legacy hooks keep receiving the built-in helpers exactly as before. A
    // class section resolves the run's namespace on first read, so a section
    // that ignores `h` does not invoke the config factory.
    get h() {
      if (resolved.kind !== 'class') return helpers;
      if (typeof lazyHelpers === 'function') return lazyHelpers();
      return lazyHelpers ?? helpers;
    },
  }) as T;
};

/** @description An enquirer select-style question used by the interactive picker. */
interface PickQuestion {
  type: 'select';
  name: string;
  message: string;
  choices: string[];
}

/** @description A picker answer map (`{ <question name>: <chosen value> }`). */
type PickAnswer = Record<string, unknown>;

/** @description The result of the interactive generator/action picker. */
export interface PickResult {
  /** @description The chosen generator name. */
  generator: string;
  /** @description The chosen action name within the generator. */
  action: string;
}

/**
 * @description Reads the answer value under a question name when it is a non-empty
 * string; otherwise `undefined` (a prompter that did not answer as expected).
 */
const answerValue = (answer: PickAnswer, name: string): string | undefined => {
  const value = answer[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

/**
 * @description Runs the two-level interactive generator/action picker. Lists the
 * generators discoverable in the templates root (a top-level directory containing
 * at least one action subdirectory), then the action subdirectories of the chosen
 * generator; the selection is returned as if it had been passed positionally. When
 * the templates root is absent or holds no pickable generator, a "no generators
 * found" guidance message is logged and `null` is returned — no empty menu is shown.
 * @param config - The resolved runner configuration (templates, prompter, logger).
 * @returns The picked `{ generator, action }`, or `null` when no selection is possible.
 * */
export const pickGeneratorAction = async (
  config: RunnerConfig,
): Promise<PickResult | null> => {
  const { templates, logger } = config;
  if (!templates || !fs.existsSync(templates)) {
    logger.log(`No generators found.

  The interactive picker needs a _templates folder here, or anywhere up the folder tree.
  Create one with: $ hygen init self
`);
    return null;
  }

  const generators = pickableGenerators(templates);
  if (generators.length === 0) {
    logger.log(`No generators found.

  Every top-level folder in _templates should hold at least one action subfolder.
  Create one with: $ hygen with-prompt new my-generator
`);
    return null;
  }

  const prompter = config.createPrompter<PickQuestion, PickAnswer>();
  const generatorAnswer = await prompter.prompt({
    type: 'select',
    name: 'generator',
    message: 'Select a generator:',
    choices: generators,
  });
  const generator = answerValue(generatorAnswer, 'generator');
  if (!generator) return null;

  const actions = generatorActions(templates, generator);
  const actionPrompter = config.createPrompter<PickQuestion, PickAnswer>();
  const actionAnswer = await actionPrompter.prompt({
    type: 'select',
    name: 'action',
    message: `Select an action for ${generator}:`,
    choices: actions,
  });
  const action = answerValue(actionAnswer, 'action');
  if (!action) return null;

  return { generator, action };
};

export default prompt;
