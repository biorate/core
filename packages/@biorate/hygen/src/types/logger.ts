/**
 * @description Minimal output-printing surface that the runner uses to report
 * progress, warnings and errors. An implementation may wrap `console.log`, a
 * logger library, or some sink that accepts a single string per call. */
export interface Logger {
  /** @description Print a success/progress message. */
  ok: (msg: string) => void;
  /** @description Print an informational (magenta) notice. */
  notice: (msg: string) => void;
  /** @description Print a yellow warning. */
  warn: (msg: string) => void;
  /** @description Print a red error. */
  err: (msg: string) => void;
  /** @description Print a plain message (no color coding). */
  log: (msg: string) => void;
  /** @description Interpolate `chalk` tags embedded in a message and print it. */
  colorful: (msg: string) => void;
}
