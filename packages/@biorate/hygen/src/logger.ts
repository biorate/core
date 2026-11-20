import chalk from 'chalk';

const { yellow, red, green, magenta, bold } = chalk as unknown as {
  yellow: (x: string) => string;
  red: (x: string) => string;
  green: (x: string) => string;
  magenta: (x: string) => string;
  bold: (x: string) => string;
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

  /**
   * @description Print a multi-line notice. Historically this method ran the
   * text through `chalk.template` for `{style}` markup, but that helper is a
   * template-tag function: calling it positionally produced the infamous
   * `[object Function]` prefix in help output, and a correct tag invocation
   * would crash on any literal brace in template messages. Messages are
   * therefore printed as-is; bold headers go through `colorfulHeader`. */
  colorful(msg: string) {
    this.log(msg);
  }

  /**
   * @description Print a message whose first line is a bold header and whose
   * body is plain text (the header stays readable when styling is disabled). */
  colorfulHeader(header: string, body: string) {
    this.log(`${bold(header)}:\n${body}`);
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
