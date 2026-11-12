import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { engine } from '../src/engine';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'engine', ...segments);

// A shared fake prompter records every prompt call and returns a configurable answer.
let promptCalls: string[] = [];
let promptAnswer: Record<string, unknown> = {};
const makePrompter = () => ({
  prompt: async <Q, T>(q: Q): Promise<T> => {
    const question = (Array.isArray(q) ? q[0] : q) as { name?: string } | undefined;
    promptCalls.push(question?.name ?? '?');
    return promptAnswer as T;
  },
});

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger(() => {}), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => makePrompter(),
});

const cleanCwd = async (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-engine-'));

const pairSequence = (results: Array<Record<string, unknown>>): string[] => [
  ...new Set(results.map((r) => `${r.action}:${r.name}`)),
];

describe('engine: expansion loop (2.1-2.3)', () => {
  beforeEach(() => {
    promptCalls = [];
    promptAnswer = {};
  });

  it('runs (name, action) pairs in name-outer × action-inner order', async () => {
    const cwd = await cleanCwd();
    const results = (await engine(
      ['gen', 'model,controller', 'a,b'],
      makeConfig(cwd),
    )) as Array<Record<string, unknown>>;
    expect(pairSequence(results)).toEqual([
      'model:a',
      'controller:a',
      'model:b',
      'controller:b',
    ]);
  });

  it('invokes each action prompt hook once per (name, action) pair', async () => {
    const cwd = await cleanCwd();
    await engine(['gen', 'model,controller', 'a,b'], makeConfig(cwd));
    expect(promptCalls).toHaveLength(4);
  });

  it('fails fast: stops at the first failing pair and reports it', async () => {
    const cwd = await cleanCwd();
    await expect(
      engine(['gen', 'model,boom,controller', 'a'], makeConfig(cwd)),
    ).rejects.toThrow(/action 'boom' for name 'a' failed/);
    // model ran (a file was written) but controller did not (fail-fast stops the loop)
    expect(await fs.pathExists(path.join(cwd, 'out', 'model-a.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'out', 'controller-a.txt'))).toBe(false);
  });

  it('keep-going runs every pair and collects every failure', async () => {
    const cwd = await cleanCwd();
    let err: unknown;
    try {
      await engine(
        ['gen', 'model,boom,controller', 'a,b', '--keep-going'],
        makeConfig(cwd),
      );
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(Error);
    const message = (err as Error).message;
    expect(message).toMatch(/run failed for 2 pair\(s\)/);
    expect(message).toContain("action 'boom' for name 'a'");
    expect(message).toContain("action 'boom' for name 'b'");
    // model and controller outputs exist for both names: later pairs did run
    expect(await fs.pathExists(path.join(cwd, 'out', 'model-a.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'out', 'controller-a.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'out', 'model-b.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(cwd, 'out', 'controller-b.txt'))).toBe(true);
  });

  it('applies --subaction within each listed action', async () => {
    const cwd = await cleanCwd();
    const results = (await engine(
      ['gen', 'model,controller', 'a', '--subaction', 'extra'],
      makeConfig(cwd),
    )) as Array<Record<string, unknown>>;
    // only the `extra` template is rendered in both actions; `emit` is filtered out
    const subjects = results.map((r) => r.subject as string).sort();
    expect(subjects).toEqual(['out/controller-extra-a.txt', 'out/model-extra-a.txt']);
    expect(results).toHaveLength(2);
  });
});

describe('engine: name precedence (2.4)', () => {
  beforeEach(() => {
    promptCalls = [];
  });

  it('resolves name as prompt hook answer > positional name > --name flag', async () => {
    // prompt hook answers with `promptAnswer`; positional and flag also supply a name.
    // The `--name` flag only reaches the run under the legacy escape, so this config
    // enables it.
    promptAnswer = { name: 'promptAnswer' };
    const cwd = await cleanCwd();
    const results = (await engine(['gen', 'model', 'posName', '--name', 'flagName'], {
      ...makeConfig(cwd),
      legacyNameFlag: true,
    })) as Array<Record<string, unknown>>;
    const subjects = results.map((r) => r.subject as string);
    expect(subjects).toContain('out/model-promptAnswer.txt');
    expect(subjects).not.toContain('out/model-posName.txt');
    expect(subjects).not.toContain('out/model-flagName.txt');
  });
});
