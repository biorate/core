import { TimeIncorrectFormatError } from './errors';

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

/**
 * @description
 * Conver milliseconds to microsecoonds (µs), milliseconds (ms), seconds (s), minutes (m), hours (h), days (d)
 * @example
 * ```ts
 *   const time = time.diff();
 *   console.log(time());
 * ```
 */
export const msTo = (
  time: number,
  format: 'µs' | 'ms' | 's' | 'm' | 'h' | 'd' = 'ms',
  digits = -1,
) => {
  let result: number;
  switch (format) {
    case 'µs':
      result = time * 1000;
      break;
    case 'ms':
      result = time;
      break;
    case 's':
      result = time / 1000;
      break;
    case 'm':
      result = time / 1000 / 60;
      break;
    case 'h':
      result = time / 1000 / 60 / 60;
      break;
    case 'd':
      result = time / 1000 / 60 / 60 / 24;
      break;
  }
  if (result) return digits > -1 ? Number(result.toFixed(digits)) : result;
  throw new TimeIncorrectFormatError(format);
};
