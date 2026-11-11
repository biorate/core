import fs from 'fs-extra';
import type { ActionResult, RunnerConfig } from './types';
import params from './params';
import { ShowHelpError } from './errors';
import { isHelpFlag, printUsage } from './cli-help';

/**
 * @description The validation + render&rarr;execute pipeline. Parses arguments,
 * validates that a generator/action and its folder exist (throwing
 * `ShowHelpError` when they do not), then renders and executes the actions.
 * @param argv - The CLI-style arguments.
 * @param config - The resolved runner configuration.
 * @returns The executed operation outcomes.
 * */
const engine = async (argv: string[], config: RunnerConfig): Promise<ActionResult[]> => {
  const { cwd, templates, logger } = config;
  const args = Object.assign(await params(config, argv), { cwd });
  const { generator, action, actionfolder } = args;

  if (isHelpFlag(argv)) {
    printUsage(logger);
  }

  logger.log(args.dry ? '(dry mode)' : '');
  if (!generator) {
    throw new ShowHelpError('please specify a generator.');
  }

  if (!action) {
    throw new ShowHelpError(`please specify an action for ${generator}.`);
  }

  logger.log(`Loaded templates: ${templates!.replace(`${cwd}/`, '')}`);
  if (!(await fs.pathExists(actionfolder!))) {
    throw new ShowHelpError(`I can't find action '${action}' for generator '${generator}'.

      You can try:
      1. 'hygen init self' to initialize your project, and
      2. 'hygen generator new --name ${generator}' to build the generator you wanted.

      Check out the quickstart for more: http://www.hygen.io/docs/quick-start
      `);
  }

  // lazy loading these dependencies gives a better feel once
  // a user is exploring hygen (not specifying what to execute)
  const execute = (await import('./execute')).execute;
  const render = (await import('./render')).render;
  return execute(await render(args, config), args, config);
};

export { engine, ShowHelpError };
