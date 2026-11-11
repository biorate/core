import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import type { Logger } from './types';
import { DEFAULT_ACTION } from './params';

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

const VERSION = readVersion();

// Detects the `--version`/`-v` CLI switch. Parsed in bin.ts (not params.ts) so the
// argument parser shape stays untouched; the CLI prints the version and exits 0 early.
const isVersionFlag = (args: string[]) =>
  args.includes('--version') || args.includes('-v');

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

const printHelp = (templates: string | undefined, logger: Logger) => {
  logger.log(`Hygen v${VERSION}`);
  logger.log('\nAvailable actions:');
  if (!templates) {
    logger.log(`No generators or actions found. 

      This means I didn't find a _templates folder right here, 
      or anywhere up the folder tree starting here.

      Here's how to start using Hygen:

      $ hygen init self
      $ hygen with-prompt new --name my-generator

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

export { availableActions, printHelp, VERSION, isVersionFlag };
