/**
 * @description
 * Promise-wrap for setTimeout
 * @param timeout - Time to wait
 * @example
 * ```ts
 *   await timer.wait(1000);
 * ```
 */
export function wait(timeout = 0) {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

/**
 * @description
 * Promise-wrap for process.nextTick
 * @example
 * ```ts
 *   await timer.tick();
 * ```
 */
export function tick() {
  return new Promise<void>((resolve) => process.nextTick(resolve));
}

/**
 * @description
 * Promise-wrap for setImmediate
 * @example
 * ```ts
 *   await timer.immediate();
 * ```
 */
export function immediate() {
  return new Promise<void>((resolve) => setImmediate(resolve));
}
