import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { engine } from '../src/engine';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

type Locals = Record<string, unknown>;

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'helpers-contract', ...segments);

let calls: Array<{ locals: Locals }> = [];

// Eager-validation factory: the 0.3.0 bootstrap call passed `{}` and made this
// shape throw before any render.
const strictFactory = (locals: Locals): Record<string, unknown> => {
  if (locals._ === undefined) throw new Error('helpers factory requires positionals');
  calls.push({ locals: { ...locals } });
  return { tag: 'factory' };
};

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => ({ prompt: async () => ({}) }),
  helpers: strictFactory,
});

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-helpers-'));

const logEntries = (): string[] =>
  (globalThis as { __helperLog?: string[] }).__helperLog ?? [];

// Hook-scoped resolution receives only the CLI arguments, while render locals
// also carry the action metadata, which distinguishes the two call sites.
const cliCalls = (): Array<{ locals: Locals }> =>
  calls.filter(
    ({ locals }) => locals.action === undefined && locals.templates === undefined,
  );

describe('helpers factory invocation contract', () => {
  beforeEach(() => {
    calls = [];
    (globalThis as { __helperLog?: string[] }).__helperLog = [];
    (globalThis as { __helperRefs?: Locals[] }).__helperRefs = [];
  });

  it('does not invoke the factory at bootstrap for a hook-less config', async () => {
    const cwd = await cleanCwd();

    const results = await engine(['plain', 'new', 'alpha'], makeConfig(cwd));

    expect(results).toHaveLength(1);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every(({ locals }) => locals.name === 'alpha')).toBe(true);
    expect(calls.every(({ locals }) => Array.isArray(locals._))).toBe(true);
    await expect(fs.pathExists(path.join(cwd, 'alpha-plain.txt'))).resolves.toBe(true);
  });

  it('resolves hook helpers once per run from CLI arguments including positionals', async () => {
    const cwd = await cleanCwd();

    await engine(['probe', 'new', 'alpha', '--flavor=vanilla'], makeConfig(cwd));

    const refs = (globalThis as { __helperRefs?: Locals[] }).__helperRefs ?? [];
    expect(refs).toHaveLength(4);
    expect(new Set(refs).size).toBe(1);
    expect(refs[0].tag).toBe('factory');
    expect(logEntries()).toEqual([
      'probe.beforeAll:factory',
      'probe.beforeEach:factory',
      'probe.afterEach:factory',
      'probe.afterAll:factory',
    ]);

    const resolvedForHooks = cliCalls();
    expect(resolvedForHooks).toHaveLength(1);
    expect(resolvedForHooks[0].locals._).toEqual(['probe', 'new', 'alpha']);
    expect(resolvedForHooks[0].locals.flavor).toBe('vanilla');
    expect(resolvedForHooks[0].locals.name).toBeUndefined();
  });

  it('does not invoke the factory outside rendering when hooks ignore h', async () => {
    const cwd = await cleanCwd();

    await engine(['silent', 'new', 'alpha'], makeConfig(cwd));

    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every(({ locals }) => locals.name === 'alpha')).toBe(true);
    expect(cliCalls()).toHaveLength(0);
    expect(logEntries()).toEqual([
      'silent.beforeAll',
      'silent.beforeEach',
      'silent.afterEach',
      'silent.afterAll',
    ]);
  });

  it('passes lazily resolved helpers to a class prompt section', async () => {
    const cwd = await cleanCwd();

    await engine(['ask', 'new', 'alpha', '--flavor=vanilla'], makeConfig(cwd));

    expect(logEntries()).toEqual(['ask.prompt:factory']);
    const resolvedForHooks = cliCalls();
    expect(resolvedForHooks).toHaveLength(1);
    expect(resolvedForHooks[0].locals.flavor).toBe('vanilla');
    const content = await fs.readFile(path.join(cwd, 'alpha-ask.txt'), 'utf8');
    expect(content).toContain('ask factory');
  });

  it('does not resolve helpers for a prompt section that ignores h', async () => {
    const cwd = await cleanCwd();

    await engine(['ignoring', 'new', 'alpha'], makeConfig(cwd));

    expect(logEntries()).toEqual(['ignoring.prompt']);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every(({ locals }) => locals.name === 'alpha')).toBe(true);
    expect(cliCalls()).toHaveLength(0);
  });
});
