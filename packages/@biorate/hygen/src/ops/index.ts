import type { Op } from '../types';

/**
 * @description Resolves which operations to run for a rendered action based on
 * its attributes (`to`, `echo`, `sh`, `setup`, …). Operations are lazily
 * imported so only the executed ones are loaded.
 * @param attributes - The rendered action attributes.
 * @returns The ordered list of operations to execute.
 * */
const resolve = async (attributes: Record<string, unknown>): Promise<Op[]> => {
  const ops: Op[] = [];
  // a file target exists either via explicit `to:` or opt-in mirroring
  // (`mirror: true` with no `sh`); shell-only templates stay no-ops.
  const isAddTarget =
    Boolean(attributes.to) || (attributes.mirror === true && !attributes.sh);
  if (isAddTarget && !attributes.inject && !attributes.replace) {
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
