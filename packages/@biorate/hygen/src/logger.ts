import chalk from 'chalk';

// chalk 4.1.2 doesn't type template property
const { yellow, red, green, magenta, template } = chalk as unknown as {
  yellow: (x: string) => string;
  red: (x: string) => string;
  green: (x: string) => string;
  magenta: (x: string) => string;
  template: (chalk: unknown, ...args: unknown[]) => string;
};

/**
 * @description A `Logger` implementation that colors/interpolates messages and
 * forwards them to a supplied sink function.
 * */
class Logger {
  /** @description Plain text output sink. */
  log: (message: string) => void;

  /** @description Create a logger wrapping the given output sink. */
  constructor(log: (message: string) => void) {
    this.log = log;
  }

  /** @description Print a message with `chalk` tags interpolated. */
  colorful(msg: string) {
    this.log(template(chalk, msg));
  }

  /** @description Print a magenta notice. */
  notice(msg: string) {
    this.log(magenta(msg));
  }

  /** @description Print a yellow warning. */
  warn(msg: string) {
    this.log(yellow(msg));
  }

  /** @description Print a red error. */
  err(msg: string) {
    this.log(red(msg));
  }

  /** @description Print a green success message. */
  ok(msg: string) {
    this.log(green(msg));
  }
}
export default Logger;
