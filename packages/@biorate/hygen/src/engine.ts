import path from 'path';
import fs from 'fs-extra';
import type { ActionResult, RunnerConfig, RunFailure } from './types';
import params from './params';
import prompt from './prompt';
import { ShowHelpError, KeepGoingError } from './errors';
import { isHelpFlag, printUsage } from './cli-help';

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
 * @returns The executed operation outcomes, annotated with their source pair.
 * */
const engine = async (argv: string[], config: RunnerConfig): Promise<ActionResult[]> => {
  const { cwd, templates, logger } = config;
  const base = Object.assign(await params(config, argv), { cwd });
  const { generator, actions, names } = base;
  const cleanArgv = (base.cleanArgv ?? {}) as Record<string, unknown>;

  if (isHelpFlag(argv)) {
    printUsage(logger);
  }

  logger.log(base.dry ? '(dry mode)' : '');
  if (!generator) {
    throw new ShowHelpError('please specify a generator.');
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
      const singleRun = nameList.length === 1 && actions.length === 1;

      if (!(await fs.pathExists(actionfolder))) {
        const err =
          new ShowHelpError(`I can't find action '${action}' for generator '${generator}'.

      You can try:
      1. 'hygen init self' to initialize your project, and
      2. 'hygen generator new --name ${generator}' to build the generator you wanted.

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
        const pairResults = await execute(await render(args, config), args, config);
        for (const pairResult of pairResults) {
          results.push({
            ...pairResult,
            action,
            ...(name !== undefined ? { name } : {}),
          });
        }
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
      }
    }
  }

  if (failures.length > 0) {
    // keep-going collected failures: carry the partial results and the
    // structured failure list so `runner` can surface them in `RunnerResult`.
    throw new KeepGoingError(failures, results);
  }

  return results;
};

export { engine, ShowHelpError, KeepGoingError };
