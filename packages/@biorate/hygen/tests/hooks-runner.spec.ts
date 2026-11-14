import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import Logger from '../src/logger';
import type { HookContext, RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) => path.join(__dirname, 'fixtures', ...segments);

const log = (entry: string): void => {
  (globalThis as { __hookLog?: string[] }).__hookLog?.push(entry);
};

const makeConfig = (cwd: string, templates: string): RunnerConfig => ({
  cwd,
  templates,
  logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: <Q, T>() => ({ prompt: async (_arg0: Q) => ({} as T) }),
  hooks: {
    beforeAll: () => log('project.beforeAll'),
    beforeEach: (ctx: HookContext) => log(`project.beforeEach:${ctx.name ?? '-'}`),
    afterEach: (_ctx, results) => log(`project.afterEach:${results.length}`),
    afterAll: (_ctx, results) => log(`project.afterAll:${results.length}`),
  },
});

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-runner-'));

describe('runner() integration with lifecycle hooks', () => {
  beforeEach(() => {
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = undefined;
  });

  it('fires project and action hooks through the embeddable API', async () => {
    const cwd = await cleanCwd();
    const result = await runner(
      ['gen', 'new', 'alpha'],
      makeConfig(cwd, fixture('hooks-lifecycle', '_templates')),
    );

    expect(result.success).toBe(true);
    expect(result.actions).toHaveLength(1);
    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'project.beforeAll',
      'action.beforeAll:new:-',
      'project.beforeEach:alpha',
      'action.beforeEach:alpha:1:false',
      'action.prompt',
      'action.afterEach:alpha:1:1',
      'project.afterEach:1',
      'action.afterAll:new:1',
      'project.afterAll:1',
    ]);
  });

  it('reports a hook failure as an unsuccessful run with failures and statuses', async () => {
    (globalThis as { __hookFail?: Record<string, unknown> }).__hookFail = {
      beforeEach: { message: 'beforeEach boom', name: 'alpha' },
    };
    const cwd = await cleanCwd();
    const result = await runner(
      ['gen', 'new', 'alpha,beta', '--keep-going'],
      makeConfig(cwd, fixture('hooks-errors', '_templates')),
    );

    expect(result.success).toBe(false);
    expect(result.failures).toEqual([
      { action: 'new', name: 'alpha', error: 'beforeEach boom' },
    ]);
    expect(result.statuses).toContainEqual({
      action: 'new',
      name: 'alpha',
      status: 'failed',
    });
    expect(result.actions).toHaveLength(1);
  });
});
