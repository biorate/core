import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'composition');
const templatesSrc = path.join(fixtureRoot, '_templates');

// A capturing sink so an E2E run can assert the error text the runner logs:
// `runner()` folds a `TemplateNotFoundError` into its `success:false` result and
// forwards the message to the logger (it is not surfaced on `result.failure`).
let log: string[] = [];
const logSink = (msg: string) => {
  log.push(msg);
};

// The composition fixture has no prompt hooks and no `sh` templates, so the
// `exec` is a no-op and `enquirer` is never prompted (blank fresh cwd).
const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  // config-resolver falls back to <cwd>/_templates once the fixture is copied there
  templates: undefined,
  logger: new Logger(logSink),
  debug: false,
  exec: () => undefined,
  createPrompter: () => require('enquirer'),
});

const copyFixture = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-composition-'));
  await fs.copy(templatesSrc, path.join(dir, '_templates'));
  return dir;
};

const read = async (cwd: string, rel: string): Promise<string> =>
  (await fs.readFile(path.join(cwd, rel))).toString();

describe('composition: multi-action E2E (4.1)', () => {
  beforeEach(() => {
    log = [];
  });

  it('runs a comma action list sequentially, writing both outputs and annotating actions', async () => {
    const dir = await copyFixture();

    const result = await runner(['comp', 'alpha,beta', 'value'], makeConfig(dir));
    expect(result.success).toBe(true);

    const alphaFile = path.join(dir, 'out', 'value', 'alpha.txt');
    const betaFile = path.join(dir, 'out', 'value', 'beta.txt');
    expect(await fs.pathExists(alphaFile)).toBe(true);
    expect(await fs.pathExists(betaFile)).toBe(true);
    expect(await read(dir, path.join('out', 'value', 'alpha.txt'))).toContain(
      'value-alpha',
    );
    expect(await read(dir, path.join('out', 'value', 'beta.txt'))).toContain(
      'value-beta',
    );

    // one operation outcome per action, in list order, each carrying its source action
    const actionFields = result.actions.map((a) => a.action);
    expect(actionFields).toEqual(['alpha', 'beta']);
  });

  it('names the missing element when a listed action does not exist', async () => {
    const dir = await copyFixture();

    const result = await runner(['comp', 'alpha,gamma', 'value'], makeConfig(dir));
    expect(result.success).toBe(false);

    // the logged error names the specific missing action from the list
    expect(log.join('\n')).toContain('gamma');
  });
});

describe('composition: name-outer expansion E2E (4.2)', () => {
  beforeEach(() => {
    log = [];
  });

  it('expands a comma name list in order, rendering both names', async () => {
    const dir = await copyFixture();

    const result = await runner(['comp', 'alpha', 'x,y'], makeConfig(dir));
    expect(result.success).toBe(true);

    expect(await fs.pathExists(path.join(dir, 'out', 'x', 'alpha.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'out', 'y', 'alpha.txt'))).toBe(true);

    // name-outer order: the `name` field sequence follows the positional order
    const nameFields = result.actions.map((a) => a.name);
    expect(nameFields).toEqual(['x', 'y']);
  });

  it('bare+variant: a comma positional with no matching action folder is names for `_default`', async () => {
    const dir = await copyFixture();

    // no `comp/x,y` folder and no `comp/x` / `comp/y` actions → names for `_default`
    const result = await runner(['comp', 'x,y'], makeConfig(dir));
    expect(result.success).toBe(true);

    expect(await fs.pathExists(path.join(dir, 'out', 'x', 'default.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(dir, 'out', 'y', 'default.txt'))).toBe(true);
    expect(await read(dir, path.join('out', 'x', 'default.txt'))).toContain('x-default');
    expect(await read(dir, path.join('out', 'y', 'default.txt'))).toContain('y-default');

    const nameFields = result.actions.map((a) => a.name);
    expect(nameFields).toEqual(['x', 'y']);
    expect(result.actions.every((a) => a.action === '_default')).toBe(true);
  });
});

describe('composition: mirror E2E (4.3)', () => {
  beforeEach(() => {
    log = [];
  });

  it('writes a mirrored template under cwd with the default `.t` suffix rule', async () => {
    const dir = await copyFixture();

    const result = await runner(['comp', 'mir', 'value'], makeConfig(dir));
    expect(result.success).toBe(true);

    // mirror target = template path relative to the action folder, resolved vs cwd,
    // with the trailing `.t` stripped by default (parts/header.ejs.t → parts/header.ejs)
    const target = path.join(dir, 'parts', 'header.ejs');
    expect(await fs.pathExists(target)).toBe(true);
    expect((await fs.readFile(target)).toString()).toContain('header value');
  });
});
