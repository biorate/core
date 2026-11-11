import type { RunnerConfig, RunnerResult } from './types';
import resolve from './config-resolver';
import Logger from './logger';
import engine, { ShowHelpError } from './engine';

import { VERSION, availableActions, printHelp } from './help';
import * as errors from './errors';

const runner = async (argv: string[], config: RunnerConfig): Promise<RunnerResult> => {
  const resolvedConfig = await resolve(config);
  const { templates, logger } = resolvedConfig;
  try {
    const actions = await engine(argv, resolvedConfig);
    return { success: true, actions, time: 0 };
  } catch (err) {
    const e = err as Error;
    logger.log(e.toString());
    if (resolvedConfig.debug) {
      logger.log('details -----------');
      logger.log(e.stack ?? '');
      logger.log('-------------------');
    }
    if (err instanceof ShowHelpError) {
      printHelp(templates, logger);
    }
    return { success: false, actions: [], time: 0 };
  }
};

export { runner, engine, resolve, printHelp, availableActions, Logger, VERSION };
export { errors };
