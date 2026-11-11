import type { Logger } from './types';

// Kept verbatim from the original engine so the CLI output is 1:1.
/** @description The `hygen` usage message printed for `-h`/`--help`. */
const USAGE = `
Usage:
  hygen [option] GENERATOR ACTION [--name NAME] [data-options]

Options:
  -h, --help # Show this message and quit
  --dry      # Perform a dry run.  Files will be generated but not saved.`;

/** @description True when the first CLI arg is the `-h`/`--help` help switch. */
export const isHelpFlag = (argv: string[]): boolean => ['-h', '--help'].includes(argv[0]);

/**
 * @description Prints the usage message to the supplied logger and terminates the
 * process. This is a CLI concern (not engine logic), so `process.exit` stays here. */
export const printUsage = (logger: Logger): void => {
  logger.log(USAGE);
  process.exit(0);
};
