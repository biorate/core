import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'engine-macro', ...segments);

const makeConfig = (cwd: string, logs: string[] = []): RunnerConfig => ({
  cwd,
  templates: fixture('_templates'),
  logger: new Logger((msg: string) => logs.push(String(msg))),
  debug: true,
  exec: () => undefined,
  createPrompter: () => ({
    prompt: async <Q, T>(_q: Q): Promise<T> => ({} as unknown as T),
  }),
  helpers: { CLIENT_NAME: 'demo-client' },
});

const cleanCwd = async (): Promise<string> =>
  fs.mkdtemp(path.join(os.tmpdir(), 'hygen-macro-'));

describe('runner: mirror path macros', () => {
  it('resolves a $MACRO$ segment from the config helpers factory', async () => {
    const cwd = await cleanCwd();
    const result = await runner(['gen', 'client'], makeConfig(cwd));
    expect(result.success).toBe(true);
    const target = path.join(cwd, 'apps', 'demo-client', 'src', 'index.ts');
    expect(await fs.pathExists(target)).toBe(true);
    expect(await fs.readFile(target, 'utf8')).toContain('export const app = true;');
  });

  it('resolves $name$ as a scalar per pass under name expansion (a,b → two passes)', async () => {
    const cwd = await cleanCwd();
    const result = await runner(['gen', 'client,byname', 'a,b'], makeConfig(cwd));
    expect(result.success).toBe(true);
    for (const name of ['a', 'b']) {
      const target = path.join(cwd, `${name}.txt`);
      expect(await fs.pathExists(target)).toBe(true);
      expect(await fs.readFile(target, 'utf8')).toContain('entity');
    }
    // every pass sees a scalar name: no literal `$name$` file or folder exists
    expect(await fs.pathExists(path.join(cwd, '$name$.txt'))).toBe(false);
  });

  it('fails the run on an unresolvable identifier and writes nothing', async () => {
    const cwd = await cleanCwd();
    const logs: string[] = [];
    const result = await runner(['gen', 'broken'], makeConfig(cwd, logs));
    // `runner` does not reject: it normalises the failure into the result and
    // logs the standardized error
    expect(result.success).toBe(false);
    expect(logs.join('\n')).toContain('cannot be resolved from the run locals');
    expect(logs.join('\n')).toContain('macro $NOPE$');
    expect(await fs.pathExists(path.join(cwd, 'broken'))).toBe(false);
  });
});
