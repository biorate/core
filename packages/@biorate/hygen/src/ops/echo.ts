import type { ActionResult, RenderedAction, RunnerConfig } from '../types';
import createResult from './result';

const notEmpty = (x: string) => x && x.length > 0;
const echo = async (
  { attributes: { echo } }: RenderedAction,
  _args: Record<string, any>,
  { logger }: RunnerConfig,
): Promise<ActionResult> => {
  const result = createResult('shell', echo);
  if (notEmpty(echo)) {
    logger.colorful(echo);
    return result('executed');
  }
  return result('ignored');
};

export default echo;
