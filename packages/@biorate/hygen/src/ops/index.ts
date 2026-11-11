import type { ActionResult, RenderedAction, RunnerConfig } from '../types';

/**
 * @description A single operation applied to one rendered action. Receives the
 * rendered action, the run's arguments and the runner configuration, and
 * resolves to the operation outcome. */
export type Op = (
  action: RenderedAction,
  args: Record<string, unknown>,
  config: RunnerConfig,
) => Promise<ActionResult>;

/**
 * @description Resolves which operations to run for a rendered action based on
 * its attributes (`to`, `echo`, `sh`, `setup`, …). Operations are lazily
 * imported so only the executed ones are loaded.
 * @param attributes - The rendered action attributes.
 * @returns The ordered list of operations to execute.
 * */
const resolve = async (attributes: Record<string, unknown>): Promise<Op[]> => {
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
