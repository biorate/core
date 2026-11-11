import path from 'path';
import fs from 'fs-extra';
import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';
import injector from './injector';

const injectOp = async (
  action: RenderedAction,
  args: Record<string, any>,
  { logger, cwd }: RunnerConfig,
): Promise<ActionResult> => {
  const {
    attributes: { to, inject, replace, create_if_missing },
  } = action;

  const result = createResult('inject', to);

  if (!((inject || replace) && to)) {
    return result('ignored');
  }

  const absTo = path.resolve(cwd, to);

  if (!(await fs.pathExists(absTo))) {
    if (create_if_missing) {
      // create the empty skeleton (and parent dirs); the body is then injected
      // into it below (create_if_missing requires an anchor such as `append`).
      await fs.ensureFile(absTo);
    } else {
      logger.err(`Cannot inject to ${to}: doesn't exist.`);
      return result('error', {
        error: `Cannot inject to ${to}: doesn't exist.`,
      });
    }
  }

  const content = (await fs.readFile(absTo)).toString();
  const injectResult = injector(action, content, to);

  if (!args.dry) {
    await fs.writeFile(absTo, injectResult);
  }
  const pathToLog = process.env.HYGEN_OUTPUT_ABS_PATH ? absTo : to;
  logger.notice(`      inject: ${pathToLog}`);

  return result('inject');
};

export default injectOp;
