import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { engine } from '../src/engine';
import resolve from '../src/config-resolver';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'hooks-project', ...segments);

const baseConfig = (cwd: string, logger: Logger): RunnerConfig => ({
  cwd,
  templates: '_templates',
  logger,
  debug: false,
  exec: () => undefined,
  createPrompter: <Q, T>() => ({ prompt: async (_arg0: Q) => ({} as T) }),
});

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-hookcfg-'));

describe('project-level hooks', () => {
  beforeEach(() => {
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
  });

  it('loads hooks from .hygen.js and warns about non-function entries', async () => {
    const warnings: string[] = [];
    const logger = new Logger(() => undefined); // eslint-disable-line @typescript-eslint/no-empty-function
    logger.warn = (msg: string) => warnings.push(msg);
    const config = await resolve(baseConfig(fixture(), logger));

    expect(typeof config.hooks?.beforeAll).toBe('function');

    const cwd = await cleanCwd();
    (globalThis as { __hookLog?: string[] }).__hookLog = [];
    await engine(['gen', 'new', 'alpha'], { ...config, cwd });

    expect(warnings.some((msg) => msg.includes('ignoredValue'))).toBe(true);

    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'project.beforeAll',
      'project.beforeEach:alpha',
      'project.afterEach:alpha:1',
      'project.afterAll:1',
    ]);
    await expect(fs.pathExists(path.join(cwd, 'alpha.txt'))).resolves.toBe(true);
  });

  it('uses the nearest .hygen.js for hooks', async () => {
    const config = await resolve(
      baseConfig(fixture('nested'), new Logger(() => undefined)), // eslint-disable-line @typescript-eslint/no-empty-function
    );

    expect(typeof config.hooks?.beforeAll).toBe('function');
    await config.hooks!.beforeAll!({
      cwd: fixture('nested'),
      templates: fixture('_templates'),
      generator: 'gen',
      action: '*',
      args: {},
      h: {},
      logger: config.logger,
      dry: false,
    });

    expect((globalThis as { __hookLog?: string[] }).__hookLog).toEqual([
      'nested.beforeAll',
    ]);
  });
});
