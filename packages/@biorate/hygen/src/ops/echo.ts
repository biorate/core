import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';

const notEmpty = (x: string) => x && x.length > 0;
/**
 * @description Prints an `echo` attribute value through the (colorful) logger.
 * @param action - The rendered action carrying the `echo` attribute.
 * @param _args - The run arguments (unused by this operation).
 * @param config - The runner configuration.
 * @returns The operation outcome.
 * */
const echo = async (
  { attributes: { echo } }: RenderedAction,
  _args: Record<string, any>,
  { logger }: RunnerConfig,
): Promise<ActionResult> => {
  const result = createResult('shell', echo);
  const echoStr = echo as string;
  if (notEmpty(echoStr)) {
    logger.colorful(echoStr);
    return result('executed');
  }
  return result('ignored');
};

export default echo;
