import path from 'path';
import fs from 'fs-extra';
import { red } from 'chalk';
import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';

/**
 * @description Resolves the write target for a rendered action. An explicit
 * `to:` always wins. When absent, opt-in mirroring (`mirror: true` and no
 * `sh`) derives the target from the template file's path relative to the
 * action folder, resolved against `cwd` (missing directories created via the
 * existing `ensureDir`). The template suffix is stripped per convention: a
 * single trailing `.t` by default (`html.ejs.t` → `html.ejs`), or the full
 * `.ejs.t` when `HYGEN_MIRROR_EJS_SUFFIX=1` is set (`html.ejs.t` → `html`).
 * Mirroring never applies with a `sh` attribute, so shell-only templates stay
 * no-ops. Returns `undefined` when neither `to` nor mirroring applies.
 * @param action - The rendered action (its `file` and `attributes`).
 * @param actionfolder - The absolute path of the action folder.
 * @returns The write target (relative to `cwd`), or `undefined`.
 * */
const targetPath = (action: RenderedAction, actionfolder: string): string | undefined => {
  const { attributes } = action;
  if (attributes.to) return attributes.to as string;
  if (attributes.mirror !== true || attributes.sh !== undefined || !action.file) {
    return undefined;
  }
  const rel = path.relative(actionfolder, action.file);
  return process.env.HYGEN_MIRROR_EJS_SUFFIX === '1'
    ? rel.replace(/\.ejs\.t$/, '')
    : rel.replace(/\.t$/, '');
};

/**
 * @description Writes a rendered action body to its `to` target (or its
 * mirrored path when `to` is absent and `mirror: true` is set). Honors
 * `unless_exists`, `skipIfExists`, overwrite confirmation via the prompter,
 * `from` copy source and the `--dry` mode; returns an
 * `added`/`skipped`/`ignored` result.
 * @param action - The rendered action to apply.
 * @param args - The run arguments (`templates`, `dry`, `actionfolder`, etc.).
 * @param config - The runner configuration.
 * @returns The operation outcome.
 * */
const add = async (
  action: RenderedAction,
  args: Record<string, any>,
  { logger, cwd, createPrompter }: RunnerConfig,
): Promise<ActionResult> => {
  const {
    attributes: { inject, unless_exists, force, from, skip_if, skipIfExists },
  } = action;
  const to = targetPath(action, args.actionfolder);
  const result = createResult('add', to);
  const prompter = createPrompter<
    { prefix: string; type: string; name: string; message: string },
    { overwrite: boolean }
  >();
  if (!to || inject) {
    return result('ignored');
  }
  const absTo = path.resolve(cwd, to);
  const shouldNotOverwrite =
    !force && unless_exists !== undefined && unless_exists === true;
  const fileExists = await fs.pathExists(absTo);

  // `skipIfExists` is a soft, non-failing skip: an existing target is left
  // untouched and reported as skipped, never triggering the overwrite prompt.
  if (skipIfExists === true && fileExists) {
    logger.warn(`     skipped: ${to}`);
    return result('skipped');
  }

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
