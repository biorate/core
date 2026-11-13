import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import add from '../src/ops/add';
import Logger from '../src/logger';
import { PathMacroResolutionError } from '../src/errors';
import type { RenderedAction, RunnerConfig } from '../src/types';

// const gemfile = `
//     source 'http://rubygems.org'
//     gem 'rails'
//     gem 'nokogiri'
//     gem 'httparty'
//     `

// TODO and inject is false
describe('add', () => {
  it('should return "skipped" if skip_if has value ', async () => {
    expect(
      await add(
        {
          attributes: {
            skip_if: 'true',
          },
          body: 'this should be skipped',
        },
        {},
        {
          logger: new Logger(console.log),
          debug: false,
          helpers: {},
          createPrompter: () => require('enquirer'),
          exec: () => undefined,
          cwd: process.cwd(),
        },
      ),
    ).toMatchSnapshot({ timing: expect.any(Number) });
  });
});

// --- mirroring (3.1-3.2) -----------------------------------------------------

const fixtureRoot = () => path.join(__dirname, 'fixtures', 'add-mirror');
const actionfolder = () => path.join(fixtureRoot(), 'action');
const template = (rel: string) => path.join(actionfolder(), rel);

const cleanCwd = async (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-add-mirror-'));

let overwriteAnswer = false;
const makeConfig = (cwd: string, extra: Partial<RunnerConfig> = {}): RunnerConfig => ({
  cwd,
  templates: fixtureRoot(),
  logger: new Logger(() => {}), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => ({
    prompt: async <Q, T>(_q: Q): Promise<T> =>
      ({ overwrite: overwriteAnswer } as unknown as T),
  }),
  ...extra,
});

describe('add: mirror (3.1-3.2)', () => {
  const enabledEnv = 'HYGEN_MIRROR_EJS_SUFFIX';
  const previous = process.env[enabledEnv];
  afterEach(() => {
    if (previous === undefined) delete process.env[enabledEnv];
    else process.env[enabledEnv] = previous;
    overwriteAnswer = false;
  });

  it('default suffix: strips one trailing `.t` (header.ejs.t → header.ejs)', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true },
      body: 'header',
    };
    await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(await fs.pathExists(path.join(cwd, 'parts', 'header.ejs'))).toBe(true);
    expect(await fs.readFile(path.join(cwd, 'parts', 'header.ejs'), 'utf8')).toBe(
      'header',
    );
  });

  it('HYGEN_MIRROR_EJS_SUFFIX=1 strips the full `.ejs.t` (header.ejs.t → header)', async () => {
    process.env[enabledEnv] = '1';
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true },
      body: 'header',
    };
    await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(await fs.pathExists(path.join(cwd, 'parts', 'header'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'parts', 'header.ejs'))).toBe(false);
  });

  it('explicit `to:` wins over mirror', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true, to: 'out/explicit.txt' },
      body: 'explicit',
    };
    await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(await fs.pathExists(path.join(cwd, 'out', 'explicit.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'parts', 'header.ejs'))).toBe(false);
  });

  it('`sh`-only template is a no-op even with mirror: true', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true, sh: 'echo hi' },
      body: 'should not be written',
    };
    const result = await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(result.status).toBe('ignored');
    expect(await fs.pathExists(path.join(cwd, 'parts', 'header.ejs'))).toBe(false);
  });

  it('reproduces nested subdirectories under cwd, creating them', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('nested/deep/leaf.ejs.t'),
      attributes: { mirror: true },
      body: 'leaf',
    };
    await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(await fs.pathExists(path.join(cwd, 'nested', 'deep', 'leaf.ejs'))).toBe(true);
  });

  it('mirror honors force overwrite of an existing file', async () => {
    const cwd = await cleanCwd();
    const target = path.join(cwd, 'parts', 'header.ejs');
    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, 'old');
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true, force: true },
      body: 'new',
    };
    expect(
      (await add(action, { actionfolder: actionfolder() }, makeConfig(cwd))).status,
    ).toBe('added');
    expect(await fs.readFile(target, 'utf8')).toBe('new');
  });

  it('mirror skips an existing file when unless_exists is set', async () => {
    const cwd = await cleanCwd();
    const target = path.join(cwd, 'parts', 'header.ejs');
    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, 'old');
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true, unless_exists: true },
      body: 'new',
    };
    expect(
      (await add(action, { actionfolder: actionfolder() }, makeConfig(cwd))).status,
    ).toBe('skipped');
    expect(await fs.readFile(target, 'utf8')).toBe('old');
  });
});

// --- path macros in mirrored targets (add-hygen-path-macros) ------------------

describe('add: mirror path macros', () => {
  it('resolves a $MACRO$ segment from config helpers', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('apps/$CLIENT_NAME$/src/index.ts.t'),
      attributes: { mirror: true },
      body: 'app',
    };
    await add(
      action,
      { actionfolder: actionfolder() },
      makeConfig(cwd, { helpers: { CLIENT_NAME: 'my-app-client' } }),
    );
    expect(
      await fs.readFile(
        path.join(cwd, 'apps', 'my-app-client', 'src', 'index.ts'),
        'utf8',
      ),
    ).toBe('app');
  });

  it('resolves macros embedded in surrounding literal text (v$VERSION$-build)', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('v$VERSION$-build/leaf.txt.t'),
      attributes: { mirror: true },
      body: 'leaf',
    };
    await add(action, { actionfolder: actionfolder(), VERSION: 2 }, makeConfig(cwd));
    expect(await fs.readFile(path.join(cwd, 'v2-build', 'leaf.txt'), 'utf8')).toBe(
      'leaf',
    );
  });

  it('resolves a macro in the file-name segment ($name$.entity.ts.t)', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('entities/$name$.entity.ts.t'),
      attributes: { mirror: true },
      body: 'entity',
    };
    await add(action, { actionfolder: actionfolder(), name: 'user' }, makeConfig(cwd));
    expect(await fs.readFile(path.join(cwd, 'entities', 'user.entity.ts'), 'utf8')).toBe(
      'entity',
    );
  });

  it('fails the run with a standardized error on an unresolvable identifier', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('bad/$NOPE$/x.txt.t'),
      attributes: { mirror: true },
      body: 'x',
    };
    const error = await add(
      action,
      { actionfolder: actionfolder() },
      makeConfig(cwd),
    ).catch((e: Error) => e);
    expect(error).toBeInstanceOf(PathMacroResolutionError);
    expect(error.message).toContain('bad/$NOPE$/x.txt.t');
    expect(error.message).toContain('macro $NOPE$');
    expect(error.message).toContain('cannot be resolved from the run locals');
    expect(await fs.pathExists(path.join(cwd, 'bad'))).toBe(false);
  });

  it('macro-free mirrored paths resolve exactly as before', async () => {
    const cwd = await cleanCwd();
    const action: RenderedAction = {
      file: template('parts/header.ejs.t'),
      attributes: { mirror: true },
      body: 'header',
    };
    await add(action, { actionfolder: actionfolder() }, makeConfig(cwd));
    expect(await fs.readFile(path.join(cwd, 'parts', 'header.ejs'), 'utf8')).toBe(
      'header',
    );
  });
});
