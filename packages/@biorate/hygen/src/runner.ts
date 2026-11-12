import type { RunnerConfig, RunnerResult } from './types';
import resolve from './config-resolver';
import { engine, ShowHelpError, KeepGoingError } from './engine';
import { printHelp } from './help';

/**
 * @description Programmatic entry point of the generator. Resolves the config
 * (templates directory and `.hygen.js`), runs the engine pipeline and normalises
 * the outcome into a `RunnerResult`. A `ShowHelpError` is routed to `printHelp`.
 * @param argv - The CLI-style arguments (e.g. `['init', 'self']`).
 * @param config - The runner configuration (templates, logger, cwd, prompter).
 * @returns The run result: success flag, elapsed time and per-operation actions.
 * @example
 * ```
 * import { runner, Logger } from '@biorate/hygen';
 *
 * const result = await runner(['app', 'new', '--name', 'myapp'], {
 *   cwd: process.cwd(),
 *   templates: '_templates',
 *   logger: new Logger((msg) => console.log(msg)),
 *   exec: (sh, body) => {},
 *   createPrompter: () => require('enquirer'),
 * });
 *
 * console.log(result.success); // true
 * ```
 * */
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
    // keep-going collected failures: keep the partial actions and the failure list
    // (fail-fast still returns an empty `actions` list as before).
    const keepGoing = err instanceof KeepGoingError ? err : undefined;
    return {
      success: false,
      actions: keepGoing ? keepGoing.results : [],
      ...(keepGoing ? { failures: keepGoing.failures } : {}),
      time: 0,
    };
  }
};

export { runner };
