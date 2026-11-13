import path from 'path';
import fs from 'fs-extra';
import type { ActionResult, ActionStatusEntry, RunnerConfig, RunFailure } from './types';
import params from './params';
import prompt, { pickGeneratorAction } from './prompt';
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

/**
 * @description The validation + render&rarr;execute pipeline. Parses arguments,
 * validates that a generator/action and its folder exist (throwing
 * `ShowHelpError` when they do not), then iterates the name-outer &times; action-inner
 * expansion: each `(name, action)` pair runs a full pipeline (prompt hook &rarr;
 * render &rarr; ops) with `args.name` as the scalar of the current expansion. Locals do
 * not carry between pairs — only CLI flags do. Fail-fast is the default; `--keep-going`
 * continues collecting failing pairs and reports them all at the end.
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

  const failures: RunFailure[] = [];
  const results: ActionResult[] = [];
  const statuses: ActionStatusEntry[] = [];

  // lazy loading these dependencies gives a better feel once
  // a user is exploring hygen (not specifying what to execute)
  const execute = (await import('./execute')).execute;
  const render = (await import('./render')).render;

  for (const name of nameList) {
    for (const action of actions) {
      const [mainAction, subaction] = action.split(':');
      const actionfolder = path.join(base.templates!, generator, mainAction);
      const pairLabel = `action '${action}'${
        name !== undefined ? ` for name '${name}'` : ''
      }`;
      const statusPair = {
        action,
        ...(name !== undefined ? { name } : {}),
      };
      const singleRun = nameList.length === 1 && actions.length === 1;

      if (!(await fs.pathExists(actionfolder))) {
        const err =
          new ShowHelpError(`I can't find action '${action}' for generator '${generator}'.

      You can try:
      1. 'hygen init self' to initialize your project, and
      2. 'hygen generator new ${generator}' to build the generator you wanted.

      Check out the quickstart for more: http://www.hygen.io/docs/quick-start
      `);
        // byte-compatible single run: propagate the original validation error
        if (singleRun) throw err;
        if (!keepGoing) throw err;
        failures.push({
          action,
          ...(name !== undefined ? { name } : {}),
          error: err.message,
        });
        statuses.push({ ...statusPair, status: 'failed' });
        continue;
      }

      try {
        const promptArgs = await prompt(config.createPrompter, actionfolder, {
          ...(name ? { name } : {}),
          ...cleanArgv,
        });
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
          results.push({
            ...pairResult,
            action,
            ...(name !== undefined ? { name } : {}),
          });
        }
        statuses.push(...el.statuses);
      } catch (err) {
        const e = err as Error;
        // byte-compatible single run: propagate the original error without a wrapper
        if (singleRun) throw err;
        if (!keepGoing) {
          throw new ShowHelpError(`${pairLabel} failed: ${e.message}`);
        }
        failures.push({
          action,
          ...(name !== undefined ? { name } : {}),
          error: e.message,
        });
        statuses.push({ ...statusPair, status: 'failed' });
      }
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
