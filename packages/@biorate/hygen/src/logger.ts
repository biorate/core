import chalk from 'chalk';

// chalk 4.1.2 doesn't type template property
const { yellow, red, green, magenta, template } = chalk as unknown as {
  yellow: (x: string) => string;
  red: (x: string) => string;
  green: (x: string) => string;
  magenta: (x: string) => string;
  template: (chalk: unknown, ...args: unknown[]) => string;
};

class Logger {
  log: (message: string) => void;

  constructor(log: (message: string) => void) {
    this.log = log;
  }

  colorful(msg: string) {
    this.log(template(chalk, msg));
  }

  notice(msg: string) {
    this.log(magenta(msg));
  }

  warn(msg: string) {
    this.log(yellow(msg));
  }

  err(msg: string) {
    this.log(red(msg));
  }

  ok(msg: string) {
    this.log(green(msg));
  }
}
export default Logger;
