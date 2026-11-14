import path from 'path';
import fs from 'fs-extra';
import type {
  ActionHooks,
  ActionResult,
  ActionStatusEntry,
  HookContext,
  Helpers,
  RunnerConfig,
  RunFailure,
} from './types';
import context from './context';
import params from './params';
import prompt, {
  normalizeProjectHooks,
  pickGeneratorAction,
  resolveActionHooks,
  type HookCache,
} from './prompt';
import { ShowHelpError, KeepGoingError } from './errors';
import { isHelpFlag, printUsage } from './cli-help';

/**
 * @description Resolves whether the run should use the interactive picker. The
 * `interactive` config field forces (`true`) or disables (`false`) the picker;
 * when absent the run is interactive only when both stdin and stdout are TTYs, so
 * a non-interactive invocation (CI, piped stdio) never prompts or hangs.
 * @param config - The runner configuration.
 * @returns True when the interactive picker is enabled for this run.
 * */
const isInteractive = ({ interactive }: RunnerConfig): boolean =>
  interactive === true
    ? true
    : interactive === false
    ? false
    : Boolean(process.stdin.isTTY && process.stdout.isTTY);

/** @description Run-scoped hook context action marker (`project.beforeAll`/`afterAll`). */
const RUN_SCOPE = '*';

/** @description Lifecycle state of one action across the run's name expansions. */
interface ActionHookState {
  /** @description Whether the action's `beforeAll` was already attempted. */
  started: boolean;
  /** @description Resolved hook object (empty when the action has no hook file). */
  hooks: ActionHooks;
  /** @description Subaction of the requested action. */
  subaction?: string;
  /** @description `beforeAll`/resolution error; its pairs are skipped when set. */
  beforeAllError?: Error;
  /** @description Results accumulated by the action's pairs, passed to `afterAll`. */
  results: ActionResult[];
}

/**
 * @description The validation + render&rarr;execute pipeline. Parses arguments,
 * validates that a generator/action and its folder exist (throwing
 * `ShowHelpError` when they do not), then iterates the name-outer &times; action-inner
 * expansion: each `(name, action)` pair runs a full pipeline (prompt hook &rarr;
 * render &rarr; ops) with `args.name` as the scalar of the current expansion. Locals do
 * not carry between pairs — only CLI flags do. Lifecycle hooks wrap the pipeline:
 * project hooks outside action hooks, `beforeEach` before prompting, `afterEach`
 * with the pair's results. Fail-fast is the default; `--keep-going` continues
 * collecting failing pairs and reports them all at the end.
 * @param argv - The CLI-style arguments.
 * @param config - The resolved runner configuration.
 * @returns The executed operation outcomes, annotated with their source pair; the
 * returned array additionally carries a `statuses` property with the per-action
 * three-state outcomes (the existing array contract is preserved).
 * */
const engine = async (
  argv: string[],
  config: RunnerConfig,
): Promise<ActionResult[] & { statuses: ActionStatusEntry[] }> => {
  const { cwd, templates, logger } = config;
  let base = Object.assign(await params(config, argv), { cwd });
  let { generator, actions, names } = base;

  if (isHelpFlag(argv)) {
    printUsage(logger);
  }

  // zero-positional interactive run: offer the two-level generator/action picker
  // before falling through to the missing-arguments error. A selection re-enters the
  // parser as if it were passed positionally, so every flag (`--keep-going`,
  // `--subaction`, data options) parses identically downstream.
  if (!generator && isInteractive(config) && templates && fs.pathExistsSync(templates)) {
    const picked = await pickGeneratorAction(config);
    if (picked) {
      base = Object.assign(
        await params(config, [picked.generator, picked.action, ...argv]),
        {
          cwd,
        },
      );
      ({ generator, actions, names } = base);
    }
  }

  const cleanArgv = (base.cleanArgv ?? {}) as Record<string, unknown>;
  logger.log(base.dry ? '(dry mode)' : '');
  if (!generator) {
    throw new ShowHelpError(
      'please specify a generator.\n\nTip: running `hygen` with no arguments in a terminal opens an interactive generator/action picker (requires a TTY).',
    );
  }

  if (!actions || actions.length === 0) {
    throw new ShowHelpError(`please specify an action for ${generator}.`);
  }

  logger.log(`Loaded templates: ${templates!.replace(`${cwd}/`, '')}`);

  // name-outer &times; action-inner expansion; a single run is one action &times; one name.
  const nameList = names ?? [undefined];
  const keepGoing = Boolean(cleanArgv['keep-going']);
  const singleRunAll = nameList.length === 1 && actions.length === 1;

  const failures: RunFailure[] = [];
  const results: ActionResult[] = [];
  const statuses: ActionStatusEntry[] = [];

  // lazy loading these dependencies gives a better feel once
  // a user is exploring hygen (not specifying what to execute)
  const execute = (await import('./execute')).execute;
  const render = (await import('./render')).render;

  const projectHooks = normalizeProjectHooks(config.hooks, logger);
  const hookHelpers = context({}, config).h as Helpers;
  const hookCache: HookCache = new Map();
  const actionStates = new Map<string, ActionHookState>();

  const makeCtx = (
    action: string,
    name: string | undefined,
    subaction: string | undefined,
    args: Record<string, unknown>,
  ): HookContext => ({
    cwd,
    templates: base.templates as string,
    generator: generator as string,
    action,
    ...(subaction !== undefined ? { subaction } : {}),
    ...(name !== undefined ? { name } : {}),
    args,
    h: hookHelpers,
    logger,
    dry: Boolean(base.dry),
  });

  const actionState = (action: string, subaction?: string): ActionHookState => {
    let state = actionStates.get(action);
    if (!state) {
      state = { started: false, hooks: {}, subaction, results: [] };
      actionStates.set(action, state);
    }
    return state;
  };

  /**
   * Reports a pair-attributable failure following the run's error policy:
   * single run rethrows the original error, fail-fast wraps it with the pair
   * label, and `--keep-going` collects it for the final `KeepGoingError`.
   */
  const reportPairError = (
    error: Error,
    pair: { action: string; name?: string },
    pairLabel: string,
  ): void => {
    if (singleRunAll) throw error;
    if (!keepGoing) throw new ShowHelpError(`${pairLabel} failed: ${error.message}`);
    failures.push({ ...pair, error: error.message });
    statuses.push({ ...pair, status: 'failed' });
  };

  let projectBeforeAllError: Error | undefined;
  try {
    await projectHooks.beforeAll?.(
      makeCtx(RUN_SCOPE, undefined, undefined, { ...cleanArgv }),
    );
  } catch (err) {
    projectBeforeAllError = err as Error;
  }

  let pendingError: unknown;
  const afterAllErrors: Error[] = [];

  try {
    for (const name of nameList) {
      for (const action of actions) {
        const [mainAction, subaction] = action.split(':');
        const actionfolder = path.join(base.templates!, generator, mainAction);
        const pairLabel = `action '${action}'${
          name !== undefined ? ` for name '${name}'` : ''
        }`;
        const pair = {
          action,
          ...(name !== undefined ? { name } : {}),
        };
        const pairStatus = {
          action,
          ...(name !== undefined ? { name } : {}),
        };

        if (!(await fs.pathExists(actionfolder))) {
          const err =
            new ShowHelpError(`I can't find action '${action}' for generator '${generator}'.

      You can try:
      1. 'hygen init self' to initialize your project, and
      2. 'hygen generator new ${generator}' to build the generator you wanted.

      Check out the quickstart for more: http://www.hygen.io/docs/quick-start
      `);
          // byte-compatible single run: propagate the original validation error
          if (singleRunAll) throw err;
          if (!keepGoing) throw err;
          failures.push({ ...pair, error: err.message });
          statuses.push({ ...pairStatus, status: 'failed' });
          continue;
        }

        // a failed project `beforeAll` guards every pair; action hooks never start
        if (projectBeforeAllError) {
          reportPairError(projectBeforeAllError, pair, pairLabel);
          continue;
        }

        const state = actionState(action, subaction);
        if (!state.started) {
          state.started = true;
          try {
            state.hooks = (await resolveActionHooks(actionfolder, hookCache)).instance;
            await state.hooks.beforeAll?.(
              makeCtx(action, undefined, subaction, { ...cleanArgv }),
            );
          } catch (err) {
            state.beforeAllError = err as Error;
          }
        }

        // a failed action `beforeAll` guards only this action's pairs
        if (state.beforeAllError) {
          reportPairError(state.beforeAllError, pair, pairLabel);
          continue;
        }

        const hookArgs = {
          ...(name ? { name } : {}),
          ...cleanArgv,
        };
        const pairResults: ActionResult[] = [];
        const afterErrors: Error[] = [];
        let pairStatuses: ActionStatusEntry[] = [];
        let pairError: Error | undefined;

        for (const run of [
          projectHooks.beforeEach
            ? () => projectHooks.beforeEach!(makeCtx(action, name, subaction, hookArgs))
            : undefined,
          state.hooks.beforeEach
            ? () => state.hooks.beforeEach!(makeCtx(action, name, subaction, hookArgs))
            : undefined,
        ]) {
          if (!run) continue;
          try {
            await run();
          } catch (err) {
            pairError = err as Error;
            break;
          }
        }

        if (!pairError) {
          try {
            const promptArgs = await prompt(
              config.createPrompter,
              actionfolder,
              hookArgs,
              {
                h: hookHelpers,
                cache: hookCache,
              },
            );
            const args = Object.assign(
              {
                templates: base.templates,
                actionfolder,
                generator,
                action,
                subaction,
              },
              // include positionals as special arg for templates to consume,
              // and a unique timestamp for this run
              { _: base._, ts: base.ts },
              cleanArgv,
              name ? { name } : {},
              promptArgs,
            );
            const el = await execute(await render(args, config), args, config);
            for (const pairResult of el.results) {
              const annotated = {
                ...pairResult,
                action,
                ...(name !== undefined ? { name } : {}),
              };
              results.push(annotated);
              pairResults.push(annotated);
            }
            pairStatuses = el.statuses;
          } catch (err) {
            pairError = err as Error;
          }
        }

        // pair cleanup always runs once the pair was entered, even when the
        // prompt/execution phase failed; action level first, then project level
        for (const run of [
          state.hooks.afterEach
            ? () =>
                state.hooks.afterEach!(
                  makeCtx(action, name, subaction, hookArgs),
                  pairResults,
                )
            : undefined,
          projectHooks.afterEach
            ? () =>
                projectHooks.afterEach!(
                  makeCtx(action, name, subaction, hookArgs),
                  pairResults,
                )
            : undefined,
        ]) {
          if (!run) continue;
          try {
            await run();
          } catch (err) {
            afterErrors.push(err as Error);
          }
        }

        state.results.push(...pairResults);

        if (pairError) {
          reportPairError(pairError, pair, pairLabel);
          if (keepGoing) {
            for (const err of afterErrors) failures.push({ ...pair, error: err.message });
          }
        } else if (afterErrors.length > 0) {
          statuses.push(...pairStatuses);
          reportPairError(afterErrors[0], pair, pairLabel);
          if (keepGoing) {
            for (const err of afterErrors.slice(1))
              failures.push({ ...pair, error: err.message });
          }
        } else {
          statuses.push(...pairStatuses);
        }
      }
    }
  } catch (err) {
    pendingError = err;
  } finally {
    for (const [action, state] of actionStates) {
      if (!state.started) continue;
      try {
        await state.hooks.afterAll?.(
          makeCtx(action, undefined, state.subaction, { ...cleanArgv }),
          state.results,
        );
      } catch (err) {
        afterAllErrors.push(err as Error);
      }
    }
    try {
      await projectHooks.afterAll?.(
        makeCtx(RUN_SCOPE, undefined, undefined, { ...cleanArgv }),
        results,
      );
    } catch (err) {
      afterAllErrors.push(err as Error);
    }
  }

  if (pendingError) {
    for (const err of afterAllErrors) logger.err(`afterAll failed: ${err.message}`);
    throw pendingError;
  }

  if (afterAllErrors.length > 0) {
    if (singleRunAll) throw afterAllErrors[0];
    if (!keepGoing)
      throw new ShowHelpError(`afterAll failed: ${afterAllErrors[0].message}`);
    for (const err of afterAllErrors) {
      failures.push({ action: RUN_SCOPE, error: err.message });
      statuses.push({ action: RUN_SCOPE, status: 'failed' });
    }
  }

  if (failures.length > 0) {
    // keep-going collected failures: carry the partial results, the structured
    // failure list and the per-action statuses so `runner` can surface them in
    // `RunnerResult`.
    throw new KeepGoingError(failures, results, statuses);
  }

  // the engine's array return contract is retained (existing callers treat the
  // result as a plain `ActionResult[]`); the per-action statuses are attached to
  // the array so `runner` can surface them in `RunnerResult.statuses`.
  return Object.assign(results, { statuses });
};

export { engine, ShowHelpError, KeepGoingError };
