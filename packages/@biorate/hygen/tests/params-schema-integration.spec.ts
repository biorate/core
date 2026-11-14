import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import params from '../src/params';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) => path.join(__dirname, 'fixtures', ...segments);

const makeConfig = (
  cwd: string,
  templates: string,
  extra: Partial<RunnerConfig> = {},
): RunnerConfig => ({
  cwd,
  templates,
  logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
  debug: false,
  exec: () => undefined,
  createPrompter: <Q, T>() =>
    ({
      // answers every question with a fixed value, like an interactive run
      prompt: async (questions: any) => {
        const list = questions as { name: string }[];
        return Object.fromEntries(list.map((q) => [q.name, 'widget'])) as T;
      },
    } as any),
  ...extra,
});

const cleanCwd = (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-params-schema-'));

describe('declarative params schema integration', () => {
  it('coerces flags, skips prompts for supplied parameters and renders locals', async () => {
    const cwd = await cleanCwd();
    const result = await runner(
      ['widget', 'new', '--label', 'alpha', '--count', '3'],
      makeConfig(cwd, fixture('params-schema', '_templates')),
    );
    expect(result.success).toBe(true);
    const written = result.actions[0] as { subject?: string };
    expect(written.subject).toContain('output-3.txt');
    const content = await fs.readFile(path.join(cwd, written.subject!), 'utf8');
    expect(content).toContain('label: alpha count: 3');
  });

  it('prompts for a missing required parameter and coerces the answer', async () => {
    const cwd = await cleanCwd();
    const result = await runner(
      ['widget', 'new', '--count', '1'],
      makeConfig(cwd, fixture('params-schema', '_templates')),
    );
    expect(result.success).toBe(true);
    const written = result.actions[0] as { subject?: string };
    const content = await fs.readFile(path.join(cwd, written.subject!), 'utf8');
    expect(content).toContain('label: widget');
  });

  it('keeps the existing prompt-free flow for actions without a params export', async () => {
    const cwd = await cleanCwd();
    const result = await runner(
      ['gen', 'new'],
      makeConfig(cwd, fixture('hooks-lifecycle', '_templates')),
    );
    expect(result.success).toBe(true);
    expect(result.actions).toHaveLength(1);
  });
});

describe('argCase flag-key normalization', () => {
  process.env.HYGEN_TS = '1337';
  const cfg = (templates: string, extra: Partial<RunnerConfig> = {}) => ({
    templates,
    exec: () => undefined,
    cwd: process.cwd(),
    logger: new Logger(() => undefined), // eslint-disable-line @typescript-eslint/no-empty-function
    createPrompter: <Q, T>() => ({ prompt: async (_a: Q) => ({} as T) }),
    ...extra,
  });

  it('keeps flag keys by default', async () => {
    const args = await params(
      cfg(fixture('template-folder-in-templates', '_templates')),
      ['gen', 'foo', '--my-flag', 'hello'],
    );
    expect(args.cleanArgv).toEqual({ 'my-flag': 'hello', myFlag: 'hello' });
  });

  it('normalizes hyphenated keys to UPPER_UNDERSCORE when configured', async () => {
    const args = await params(
      cfg(fixture('template-folder-in-templates', '_templates'), {
        argCase: 'upper-underscore',
      }),
      ['gen', 'foo', '--my-flag', 'hello'],
    );
    expect(args.cleanArgv).toEqual({ MY_FLAG: 'hello' });
  });

  it('normalizes camelCase keys and never touches reserved keys', async () => {
    const args = await params(
      cfg(fixture('template-folder-in-templates', '_templates'), {
        argCase: 'upper-underscore',
      }),
      ['gen', 'foo', '--myFlag', 'hi', '--ts', '9'],
    );
    expect(args.cleanArgv).toEqual({ MY_FLAG: 'hi', ts: 9 });
  });
});
