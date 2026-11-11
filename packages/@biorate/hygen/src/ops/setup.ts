import path from 'path';
import createDebug from 'debug';
import degit from 'degit';
import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';
import { SetupRepositoryError } from '../errors';
const debug = createDebug('hygen:ops:setup');
/*
XXX:
- Name -> target directory
- setup -> rename to 'from'?
-  --setup|from argument overrides setup
-  --mode argument
-  --verbose, --cache
XXX:
- testing infra: when focus added ignore snapshots
- better ignoring when focusing?
- better separation to individual tests?, rework test generation

*/

const notEmpty = (x: string) => x && x.length > 0;
/**
 * @description Clones a repository into the target path via `degit` for a
 * `setup` attribute. Honors `--dry`; the `mode`/`verbose`/`force` options are
 * forwarded to degit. Throws `SetupRepositoryError` when `setup` has no slash.
 * @param action - The rendered action carrying the `setup` attribute.
 * @param args - The run arguments (`dry`, `to`, `force`).
 * @param config - The runner configuration.
 * @returns The operation outcome.
 * */
const setup = async (
  { attributes: { setup, mode, verbose, force } }: RenderedAction,
  args: Record<string, any>,
  { logger, cwd }: RunnerConfig,
): Promise<ActionResult> => {
  const result = createResult('setup', setup);
  const setupStr = setup as string;
  if (notEmpty(setupStr)) {
    if (!setupStr.includes('/')) {
      throw new SetupRepositoryError(setupStr);
    }
    const to = args.to || '.';
    const payload = {
      setup: setupStr,
      mode: (mode as string) || 'tar',
      verbose: !!verbose,
      force: !!args.force || !!force,
      to: path.resolve(cwd, to),
    };
    if (!args.dry) {
      try {
        debug('exec %o %o', setup, payload);
        const d = degit(setupStr, {
          mode: payload.mode,
          force: payload.force,
          verbose: payload.verbose,
        });
        await d.clone(payload.to);
        debug('done');
        logger.ok(`       setup: ${setup} -> ${to}`);
      } catch (error) {
        debug('error %o', error);
        logger.err(`       setup: ${setup} ${String(error)}`);
      }
    } else {
      logger.ok(`       setup: ${setup} -> ${to}`);
    }

    return result('executed', payload);
  }
  return result('ignored');
};

export default setup;
