import createDebug from 'debug';
import ora from 'ora';
import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';
const debug = createDebug('hygen:ops:shell');

const notEmpty = (x: string) => x && x.length > 0;
/**
 * @description Runs the rendered body as a shell command via `config.exec`.
 * Honors `sh_ignore_exit` (exit code ignored) and `spinner`; an unignored
 * failure emits an error and exits the process.
 * @param action - The rendered action carrying the `sh`/`spinner` attributes.
 * @param args - The run arguments (`dry`).
 * @param config - The runner configuration.
 * @returns The operation outcome.
 * */
const shell = async (
  { attributes: { sh, spinner, sh_ignore_exit }, body }: RenderedAction,
  args: Record<string, any>,
  { logger, exec }: RunnerConfig,
): Promise<ActionResult> => {
  const result = createResult('shell', sh);
  const shStr = sh as string;
  if (notEmpty(shStr)) {
    const spin = ora(`     shell: ${spinner === true ? 'running...' : spinner}`);
    if (!args.dry) {
      try {
        debug('exec %o %o', shStr, body);
        spinner && spin.start();
        const res = await exec(shStr, body);
        debug('result %o', res);
      } catch (error) {
        if (sh_ignore_exit !== true) {
          logger.err((error as { stderr?: string }).stderr ?? String(error));
          process.exit(1);
        }
      } finally {
        spinner && spin.succeed();
      }
    }
    logger.ok(`       shell: ${sh}`);

    return result('executed');
  }
  return result('ignored');
};

export default shell;
