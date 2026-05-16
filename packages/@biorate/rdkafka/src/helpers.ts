/**
 * @description
 * Returns a high-resolution time-diff function.
 * Call the returned function to get the elapsed time in milliseconds since the initial call.
 *
 * @example
 * ```ts
 * const diff = timeDiff();
 * // ... do work ...
 * console.log(diff()); // elapsed ms
 * ```
 */
export const timeDiff = () => {
  const startTime = process.hrtime();
  return () => {
    const diff = process.hrtime(startTime);
    return diff[0] * 1e3 + diff[1] * 1e-6;
  };
};
