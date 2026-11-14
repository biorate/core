import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { engine } from '../src/engine';
import Logger from '../src/logger';
import type { HookContext, ProjectHooks, RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'hooks-lifecycle', ...segments);

const log = (entry: string): void => {
  (globalThis as { __hookLog?: string[] }).__hookLog?.push(entry);
};

const projectHooks = (): ProjectHooks => ({
  beforeAll: () => log('project.beforeAll'),
  beforeEach: (ctx: HookContext) => log(`project.beforeEach:${ctx.name ?? '-'}`),
  afterEach: (ctx: HookContext, results) =>
    log(`project.afterEach:${ctx.name ?? '-'}:${results.length}`),
  afterAll: (_ctx, results) => log(`project.afterAll:${results.length}`),
});

const makePrompter = () => ({
  prompt: async () => ({}),
});

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-hooks-'));

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => makePrompter(),
  hooks: projectHooks(),
});

describe('lifecycle hooks: ordering', () => {
  beforeEach(() => {
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
  });

  it('runs project and action hooks around one pair in the documented order', async () => {
    const cwd = await cleanCwd();

    await engine(['gen', 'new', 'alpha'], makeConfig(cwd));

    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'project.beforeAll',
      'action.beforeAll:new:-',
      'project.beforeEach:alpha',
      'action.beforeEach:alpha:1:false',
      'action.prompt',
      'action.afterEach:alpha:1:1',
      'project.afterEach:alpha:1',
      'action.afterAll:new:1',
      'project.afterAll:1',
    ]);
    await expect(fs.pathExists(path.join(cwd, 'alpha-new.txt'))).resolves.toBe(true);
  });

  it('repeats pair hooks per name and keeps one instance across pairs', async () => {
    const cwd = await cleanCwd();

    const results = await engine(['gen', 'new', 'alpha,beta'], makeConfig(cwd));

    expect(results).toHaveLength(2);
    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'project.beforeAll',
      'action.beforeAll:new:-',
      'project.beforeEach:alpha',
      'action.beforeEach:alpha:1:false',
      'action.prompt',
      'action.afterEach:alpha:1:1',
      'project.afterEach:alpha:1',
      'project.beforeEach:beta',
      'action.beforeEach:beta:2:false',
      'action.prompt',
      'action.afterEach:beta:2:1',
      'project.afterEach:beta:1',
      'action.afterAll:new:2',
      'project.afterAll:2',
    ]);
  });

  it('runs beforeAll/afterAll once per action with name-outer × action-inner loops', async () => {
    const cwd = await cleanCwd();

    await engine(['gen', 'new,other', 'alpha'], makeConfig(cwd));

    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'project.beforeAll',
      'action.beforeAll:new:-',
      'project.beforeEach:alpha',
      'action.beforeEach:alpha:1:false',
      'action.prompt',
      'action.afterEach:alpha:1:1',
      'project.afterEach:alpha:1',
      'action.beforeAll:other:-',
      'project.beforeEach:alpha',
      'action.beforeEach:alpha:1:false',
      'action.prompt',
      'action.afterEach:alpha:1:1',
      'project.afterEach:alpha:1',
      'action.afterAll:new:1',
      'action.afterAll:other:1',
      'project.afterAll:2',
    ]);
  });
});
