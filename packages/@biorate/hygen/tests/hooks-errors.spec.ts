import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { engine } from '../src/engine';
import { KeepGoingError } from '../src/errors';
import Logger from '../src/logger';
import type { HookContext, ProjectHooks, RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'hooks-errors', ...segments);

const log = (entry: string): void => {
  (globalThis as { __hookLog?: string[] }).__hookLog?.push(entry);
};

const makeConfig = (cwd: string, hooks?: ProjectHooks): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => ({ prompt: async () => ({}) }),
  ...(hooks ? { hooks } : {}),
});

const projectHooks = (fail: 'beforeAll' | 'afterAll' | undefined): ProjectHooks => ({
  beforeAll: () => {
    log('project.beforeAll');
    if (fail === 'beforeAll') throw new Error('project beforeAll boom');
  },
  beforeEach: (ctx: HookContext) => log(`project.beforeEach:${ctx.name ?? '-'}`),
  afterEach: (ctx: HookContext, results) =>
    log(`project.afterEach:${ctx.name ?? '-'}:${results.length}`),
  afterAll: () => {
    log('project.afterAll');
    if (fail === 'afterAll') throw new Error('project afterAll boom');
  },
});

const hookLog = () => (globalThis as { __hookLog?: string[] }).__hookLog ?? [];

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-hookerr-'));

const capture = async (promise: Promise<unknown>): Promise<unknown> =>
  promise.then(
    () => undefined,
    (error) => error,
  );

describe('lifecycle hooks: failure semantics', () => {
  beforeEach(() => {
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = undefined;
  });

  it('rethrows the original beforeAll error in a single run and still runs afterAll', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      beforeAll: 'beforeAll boom',
    };
    const cwd = await cleanCwd();

    await expect(engine(['gen', 'new', 'alpha'], makeConfig(cwd))).rejects.toThrow(
      'beforeAll boom',
    );

    expect(hookLog()).toContain('beforeAll:false');
    expect(hookLog()).toContain('afterAll:false');
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(false);
  });

  it('marks every guarded pair failed on a beforeAll failure under --keep-going', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      beforeAll: 'beforeAll boom',
    };
    const cwd = await cleanCwd();

    const error = (await capture(
      engine(['gen', 'new', 'alpha,beta', '--keep-going'], makeConfig(cwd)),
    )) as KeepGoingError;

    expect(error).toBeInstanceOf(KeepGoingError);
    expect(error.failures).toEqual([
      { action: 'new', name: 'alpha', error: 'beforeAll boom' },
      { action: 'new', name: 'beta', error: 'beforeAll boom' },
    ]);
    expect(error.statuses).toEqual([
      { action: 'new', name: 'alpha', status: 'failed' },
      { action: 'new', name: 'beta', status: 'failed' },
    ]);
    expect(hookLog().filter((entry) => entry === 'afterAll:false')).toHaveLength(1);
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(false);
  });

  it('skips only the failing pair on a beforeEach failure and still runs afterEach', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      beforeEach: { message: 'beforeEach boom', name: 'alpha' },
    };
    const cwd = await cleanCwd();

    const error = (await capture(
      engine(['gen', 'new', 'alpha,beta', '--keep-going'], makeConfig(cwd)),
    )) as KeepGoingError;

    expect(error).toBeInstanceOf(KeepGoingError);
    expect(error.failures).toEqual([
      { action: 'new', name: 'alpha', error: 'beforeEach boom' },
    ]);
    expect(error.results).toHaveLength(1);
    expect(hookLog().filter((entry) => entry === 'afterEach:false')).toHaveLength(2);
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(false);
    await expect(fs.pathExists(path.join(cwd, 'beta.txt'))).resolves.toBe(true);
  });

  it('fails a generated pair when afterEach throws', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      afterEach: 'afterEach boom',
    };
    const cwd = await cleanCwd();

    await expect(engine(['gen', 'new', 'alpha'], makeConfig(cwd))).rejects.toThrow(
      'afterEach boom',
    );
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(true);
  });

  it('reports an afterAll failure after green pairs as run-scoped under --keep-going', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      afterAll: 'afterAll boom',
    };
    const cwd = await cleanCwd();

    const error = (await capture(
      engine(['gen', 'new', 'alpha,beta', '--keep-going'], makeConfig(cwd)),
    )) as KeepGoingError;

    expect(error).toBeInstanceOf(KeepGoingError);
    expect(error.failures).toEqual([{ action: '*', error: 'afterAll boom' }]);
    expect(error.statuses.at(-1)).toEqual({ action: '*', status: 'failed' });
    expect(error.results).toHaveLength(2);
  });

  it('skips all pairs on a project beforeAll failure and still runs project afterAll', async () => {
    const cwd = await cleanCwd();

    const error = (await capture(
      engine(
        ['gen', 'new', 'alpha,beta', '--keep-going'],
        makeConfig(cwd, projectHooks('beforeAll')),
      ),
    )) as KeepGoingError;

    expect(error).toBeInstanceOf(KeepGoingError);
    expect(error.failures).toEqual([
      { action: 'new', name: 'alpha', error: 'project beforeAll boom' },
      { action: 'new', name: 'beta', error: 'project beforeAll boom' },
    ]);
    expect(hookLog()).toEqual(['project.beforeAll', 'project.afterAll']);
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(false);
  });

  it('fails the run when a project afterAll throws', async () => {
    const cwd = await cleanCwd();

    await expect(
      engine(['gen', 'new', 'alpha'], makeConfig(cwd, projectHooks('afterAll'))),
    ).rejects.toThrow('project afterAll boom');
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(true);
  });
});

describe('lifecycle hooks: dry mode', () => {
  beforeEach(() => {
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = undefined;
  });

  it('runs all hooks with dry=true and writes no files', async () => {
    const cwd = await cleanCwd();

    await engine(['gen', 'new', 'alpha', '--dry'], makeConfig(cwd));

    expect(hookLog()).toEqual([
      'beforeAll:true',
      'beforeEach:true',
      'afterEach:true',
      'afterAll:true',
    ]);
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(false);
  });
});
