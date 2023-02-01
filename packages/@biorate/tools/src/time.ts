/**
 * @description
 * Calculate time diff
 * @example
 * ```ts
 *   const time = time.diff();
 *   console.log(time());
 * ```
 */
export const diff = () => {
  const startTime = process.hrtime();
  return () => {
    const diff = process.hrtime(startTime);
    return diff[0] * 1e3 + diff[1] * 1e-6;
  };
};
