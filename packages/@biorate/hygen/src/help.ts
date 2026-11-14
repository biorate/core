import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import type { Logger } from './types';
import { DEFAULT_ACTION } from './constants';

// The compiled output lives in dist/cjs/src, where a literal `require('../package.json')`
// would resolve to the generated `{ "type": ... }` manifest (no `version`). Walk up to the
// nearest package.json that carries a real version so `VERSION` is correct in both the
// source tree and the built artifacts.
const readVersion = (): string => {
  let dir = __dirname;
  while (true) {
    const candidate = path.join(dir, 'package.json');
    if (fs.existsSync(candidate)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(candidate, 'utf8')) as {
          version?: unknown;
        };
        if (typeof pkg.version === 'string' && pkg.version.length > 0) return pkg.version;
      } catch {
        // malformed manifest — keep walking up
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return 'unknown';
};

/**
 * @description The running package version, resolved by walking up to the nearest
 * `package.json` that carries a real version.
 * */
const VERSION = readVersion();

// Detects the `--version`/`-v` CLI switch. Parsed in bin.ts (not params.ts) so the
// argument parser shape stays untouched; the CLI prints the version and exits 0 early.
/**
 * @description True when the given args include the `--version`/`-v` switch.
 * */
const isVersionFlag = (args: string[]) =>
  args.includes('--version') || args.includes('-v');

/**
 * @description Lists, per generator directory, the actions available under the
 * given templates root.
 * @param templates - The templates directory to inspect.
 * @returns A map of generator name to its action names.
 * */
const availableActions = (templates: string) => {
  const generators = fs
    .readdirSync(templates)
    .filter((_) => fs.lstatSync(path.join(templates, _)).isDirectory());
  return generators.reduce((acc: Record<string, string[]>, generator) => {
    const actions = fs.readdirSync(path.join(templates, generator));
    acc[generator] = actions;
    return acc;
  }, {});
};

/**
 * @description Lists, for the interactive picker, the generators that are
 * discoverable: the top-level directories of the templates root that themselves
 * contain at least one subdirectory (an action directory). A directory holding
 * only files is not a pickable generator.
 * @param templates - The templates directory to inspect.
 * @returns The eligible generator names in directory-read order.
 * */
const pickableGenerators = (templates: string): string[] =>
  fs.readdirSync(templates).filter((entry) => {
    const full = path.join(templates, entry);
    if (!fs.lstatSync(full).isDirectory()) return false;
    return fs
      .readdirSync(full)
      .some((sub) => fs.lstatSync(path.join(full, sub)).isDirectory());
  });

/**
 * @description Lists the action subdirectories of a generator, used for the
 * interactive picker's second level.
 * @param templates - The templates directory to inspect.
 * @param generator - The generator whose action directories are listed.
 * @returns The generator's action directory names in directory-read order.
 * */
const generatorActions = (templates: string, generator: string): string[] =>
  fs
    .readdirSync(path.join(templates, generator))
    .filter((entry) =>
      fs.lstatSync(path.join(templates, generator, entry)).isDirectory(),
    );

/**
 * @description Prints the `Hygen v{VERSION}` banner and the available actions,
 * or a getting-started hint when the templates directory is absent.
 * @param templates - The templates directory (or `undefined` when unresolved).
 * @param logger - The logger used to print the help text.
 * */
const printHelp = (templates: string | undefined, logger: Logger) => {
  logger.log(`Hygen v${VERSION}`);
  logger.log('\nAvailable actions:');
  if (!templates) {
    logger.log(`No generators or actions found. 

      This means I didn't find a _templates folder right here, 
      or anywhere up the folder tree starting here.

      Here's how to start using Hygen:

      $ hygen init self
      $ hygen with-prompt new my-generator

      (edit your generator in _templates/my-generator)

      $ hygen my-generator 

      See http://hygen.io for more.
      
      `);
    return;
  }
  Object.entries(availableActions(templates)).forEach(([k, v]: [string, string[]]) => {
    logger.log(
      `${chalk.bold(k)}: ${
        v.find((a) => a === DEFAULT_ACTION) ? `${k}${v.length > 1 ? ',' : ''} ` : ''
      }${v
        .filter((a) => a !== DEFAULT_ACTION)
        .map((a) => `${k} ${a}`)
        .join(', ')}`,
    );
  });
};

export {
  availableActions,
  pickableGenerators,
  generatorActions,
  printHelp,
  VERSION,
  isVersionFlag,
};
