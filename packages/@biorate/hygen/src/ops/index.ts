import type { ActionResult, RenderedAction, RunnerConfig } from '../types';

export type Op = (
  action: RenderedAction,
  args: Record<string, any>,
  config: RunnerConfig,
) => Promise<ActionResult>;

const resolve = async (attributes: Record<string, any>): Promise<Op[]> => {
  const ops: Op[] = [];
  if (attributes.to && !attributes.inject && !attributes.replace) {
    const add = (await import('./add')).default;
    ops.push(add);
  }
  if (attributes.to && (attributes.inject || attributes.replace)) {
    const inject = (await import('./inject')).default;
    ops.push(inject);
  }
  if (attributes.echo) {
    const echo = (await import('./echo')).default;
    ops.push(echo);
  }
  if (attributes.sh) {
    const shell = (await import('./shell')).default;
    ops.push(shell);
  }
  if (attributes.setup) {
    const setup = (await import('./setup')).default;
    ops.push(setup);
  }
  return ops;
};
export default resolve;
