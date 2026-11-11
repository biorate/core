import path from 'path';
import fs from 'fs-extra';
import { red } from 'chalk';
import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';

/**
 * @description Writes a rendered action body to its `to` target. Honors
 * `unless_exists`, overwrite confirmation via the prompter, `from` copy source
 * and the `--dry` mode; returns an `added`/`skipped`/`ignored` result.
 * @param action - The rendered action to apply.
 * @param args - The run arguments (`templates`, `dry`, etc.).
 * @param config - The runner configuration.
 * @returns The operation outcome.
 * */
const add = async (
  action: RenderedAction,
  args: Record<string, any>,
  { logger, cwd, createPrompter }: RunnerConfig,
): Promise<ActionResult> => {
  const {
    attributes: { to, inject, unless_exists, force, from, skip_if },
  } = action;
  const result = createResult('add', to);
  const prompter = createPrompter<
    { prefix: string; type: string; name: string; message: string },
    { overwrite: boolean }
  >();
  if (!to || inject) {
    return result('ignored');
  }
  const absTo = path.resolve(cwd, to as string);
  const shouldNotOverwrite =
    !force && unless_exists !== undefined && unless_exists === true;
  const fileExists = await fs.pathExists(absTo);

  if (shouldNotOverwrite && fileExists) {
    logger.warn(`     skipped: ${to}`);
    return result('skipped');
  }
  if (!process.env.HYGEN_OVERWRITE && fileExists && !force) {
    if (
      !(await prompter
        .prompt({
          prefix: '',
          type: 'confirm',
          name: 'overwrite',
          message: red(`     exists: ${to}. Overwrite? (y/N): `),
        })
        .then(({ overwrite }) => overwrite))
    ) {
      logger.warn(`     skipped: ${to}`);
      return result('skipped');
    }
  }

  const shouldSkip = skip_if === 'true';

  if (shouldSkip) {
    return result('skipped');
  }

  if (from) {
    const from_path = path.join(args.templates, from as string);
    const file = fs.readFileSync(from_path).toString();
    action.body = file;
  }

  if (!args.dry) {
    await fs.ensureDir(path.dirname(absTo));
    await fs.writeFile(absTo, action.body);
  }
  const pathToLog = process.env.HYGEN_OUTPUT_ABS_PATH ? absTo : to;
  logger.ok(`       ${force ? 'FORCED' : 'added'}: ${pathToLog}`);

  return result('added');
};

export default add;
