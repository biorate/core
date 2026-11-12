import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'config-cjs');
const templatesSrc = path.join(fixtureRoot, '_templates');

describe('.hygen.cjs project config', () => {
  let dir: string;

  beforeAll(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-config-cjs-'));
    await fs.copy(templatesSrc, path.join(dir, '_templates'));
    // The CJS config must be copied alongside the templates so the directory walk
    // (from `cwd` up) finds it before any parent config — resolving in a real run.
    await fs.copy(path.join(fixtureRoot, '.hygen.cjs'), path.join(dir, '.hygen.cjs'));

    const config: RunnerConfig = {
      cwd: dir,
      // config-resolver falls back to <cwd>/_templates once the fixture is copied there
      templates: undefined,
      logger: new Logger(console.log), // eslint-disable-line no-console
      debug: false,
      exec: (sh, body) =>
        execa.command(sh, {
          shell: true,
          cwd: dir,
          ...(body ? { input: body } : {}),
        }),
      createPrompter: () => require('enquirer'),
    };

    const result = await runner(['cjs', 'new', '--name', 'value'], config);
    expect(result.success).toBe(true);
  });

  it('loads project config from .hygen.cjs and merges its values into the run', async () => {
    const content = (await fs.readFile(path.join(dir, 'cjs', 'result.txt'))).toString();
    // The `fromCjs` helper is exported only by the `.hygen.cjs` config, so its
    // presence proves the CJS config file was resolved and merged in a real run.
    expect(content).toContain('cjs:value');
  });
});
