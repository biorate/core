import createDebug from 'debug';
import resolve from './ops';
import type {
  ActionResult,
  ActionStatusEntry,
  RenderedAction,
  RunnerConfig,
} from './types';
const debug = createDebug('hygen:execute');

/**
 * @description Runs a rendered action through its resolved operations, collecting
 * every outcome and printing any accumulated `message` attributes. A skipped
 * action (one whose `skip:` attribute rendered truthy) short-circuits before any
 * operation resolves: no op runs, no shell spawns, and the action is recorded as
 * `skipped` with its reason (when present) in the returned statuses and reported
 * through the logger.
 * @param renderedActions - The rendered action items to execute.
 * @param args - The run arguments.
 * @param config - The runner configuration.
 * @returns The operation outcomes plus the per-action three-state statuses.
 * */
export const execute = async (
  renderedActions: RenderedAction[],
  args: Record<string, any>,
  config: RunnerConfig,
): Promise<{ results: ActionResult[]; statuses: ActionStatusEntry[] }> => {
  const { logger } = config;
  const messages = [];
  const results: ActionResult[] = [];
  const statuses: ActionStatusEntry[] = [];
  for (const action of renderedActions) {
    const pair = {
      action: args.action as string,
      ...(args.name !== undefined ? { name: args.name as string } : {}),
    };
    // skip short-circuits before op resolution: no op is even resolved, so a
    // shell command never spawns and no file is written or injected.
    if (action.skip !== undefined) {
      logger.warn(action.skip === true ? '     skipped' : `     skipped: ${action.skip}`);
      statuses.push({
        ...pair,
        status: 'skipped',
        ...(typeof action.skip === 'string' ? { reason: action.skip } : {}),
      });
      debug('skipping action: %o', action.file);
      continue;
    }
    const { message } = action.attributes;
    if (message) {
      messages.push(message);
    }
    const ops = await resolve(action.attributes);
    debug('executing %o ops', ops.length);
    for (const op of ops) {
      debug('executing: %o', op);
      results.push(await op(action, args, config));
    }
    statuses.push({ ...pair, status: 'ok' });
    debug('executing ops: done');
  }
  if (messages.length > 0) {
    logger.colorful(`${args.action}:\n${messages.join('\n')}`);
  }

  return { results, statuses };
};
