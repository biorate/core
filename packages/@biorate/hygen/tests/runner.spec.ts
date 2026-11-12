import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'engine', ...segments);

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger(() => {}), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: () => ({
    // return nothing so the positional name flows through to the rendered targets
    prompt: async <Q, T>(_q: Q): Promise<T> => ({} as unknown as T),
  }),
});

const cleanCwd = async (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-runner-'));

describe('runner: keep-going failures (carry-over)', () => {
  it('surfaces failures and partial actions in RunnerResult', async () => {
    const cwd = await cleanCwd();
    const result = await runner(
      ['gen', 'model,boom,controller', 'a,b', '--keep-going'],
      makeConfig(cwd),
    );
    expect(result.success).toBe(false);
    // failures list every failing pair, in order
    expect(result.failures).toHaveLength(2);
    expect(result.failures?.[0]).toMatchObject({ action: 'boom', name: 'a' });
    expect(result.failures?.[1]).toMatchObject({ action: 'boom', name: 'b' });
    // partial actions that did run are preserved, not discarded
    // (model & controller each render emit + extra for names a,b => 2×2×2)
    expect(result.actions).toHaveLength(8);
    const subjects = result.actions.map((a) => a.subject as string).sort();
    expect(subjects).toEqual([
      'out/controller-a.txt',
      'out/controller-b.txt',
      'out/controller-extra-a.txt',
      'out/controller-extra-b.txt',
      'out/model-a.txt',
      'out/model-b.txt',
      'out/model-extra-a.txt',
      'out/model-extra-b.txt',
    ]);
  });

  it('fail-fast still returns an empty actions list and no failures', async () => {
    const cwd = await cleanCwd();
    const result = await runner(['gen', 'model,boom,controller', 'a'], makeConfig(cwd));
    expect(result.success).toBe(false);
    expect(result.failures).toBeUndefined();
    expect(result.actions).toHaveLength(0);
  });
});
