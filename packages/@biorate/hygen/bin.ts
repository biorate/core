#!/usr/bin/env node

import path from 'path';
import Logger from './src/logger';
import { isVersionFlag, VERSION } from './src/help';
import { runner } from './index';

const defaultTemplates = path.join(__dirname, 'templates');

// #450: `--version`/`-v` is a CLI concern caught before any generator resolution; the
// argument parser is untouched and the process exits successfully without running.
if (isVersionFlag(process.argv.slice(2))) {
  console.log(`Hygen v${VERSION}`); // eslint-disable-line no-console
  process.exit(0);
}

runner(process.argv.slice(2), {
  templates: defaultTemplates,
  cwd: process.cwd(),
  logger: new Logger(console.log.bind(console)), // eslint-disable-line no-console
  debug: !!process.env.DEBUG,
  exec: (action, body) => {
    const opts = body && body.length > 0 ? { input: body } : {};
    return require('execa').command(action, { ...opts, shell: true }); // eslint-disable-line @typescript-eslint/no-var-requires
  },
  createPrompter: () => require('enquirer'),
}).then(({ success }) => process.exit(success ? 0 : 1));
