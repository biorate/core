import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'glob');
const templatesSrc = path.join(fixtureRoot, '_templates');

let log: string[] = [];
const logSink = (msg: string) => {
  log.push(msg);
};

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: undefined,
  logger: new Logger(logSink),
  debug: false,
  exec: () => undefined,
  createPrompter: () => require('enquirer'),
});

const copyFixture = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-glob-'));
  await fs.copy(templatesSrc, path.join(dir, '_templates'));
  return dir;
};

const read = async (cwd: string, rel: string): Promise<string> =>
  (await fs.readFile(path.join(cwd, rel))).toString();

const exists = (cwd: string, rel: string): Promise<boolean> =>
  fs.pathExists(path.join(cwd, rel));

describe('glob: batch file actions (4.1)', () => {
  beforeEach(() => {
    log = [];
  });

  it('expands a glob into one rendered file per match', async () => {
    const dir = await copyFixture();

    const result = await runner(['gl', 'mod', 'foo'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await exists(dir, 'src/foo/index.ts')).toBe(true);
    expect(await exists(dir, 'src/foo/service.ts')).toBe(true);
    expect((await read(dir, 'src/foo/index.ts')).trim()).toBe('index body for foo');
    expect((await read(dir, 'src/foo/service.ts')).trim()).toBe('service body for foo');
  });

  it('shapes destination paths with base, stripExtensions and file-name EJS', async () => {
    const dir = await copyFixture();

    const result = await runner(['gl', 'shape', 'manual'], makeConfig(dir));

    expect(result.success).toBe(true);
    // `helper.ejs.t` -> strip `.ejs.t` -> `helper`
    expect(await exists(dir, 'docs/manual/helper')).toBe(true);
    // nested path preserved below `base`, `.t` stripped
    expect(await exists(dir, 'docs/manual/nested/deep.ts')).toBe(true);
    // EJS in the file name is rendered against the run locals
    expect(await exists(dir, 'docs/manual/README-manual')).toBe(true);
    expect((await read(dir, 'docs/manual/nested/deep.ts')).trim()).toBe(
      'deep for manual',
    );
  });

  it('fails with a configuration error when glob is combined with mirroring', async () => {
    const dir = await copyFixture();

    const result = await runner(['gl', 'conflict', 'x'], makeConfig(dir));

    expect(result.success).toBe(false);
    expect(log.join('\n')).toContain('GlobMirrorConflictError');
  });

  it('expands the glob once per name in a comma name list', async () => {
    const dir = await copyFixture();

    const result = await runner(['gl', 'multi', 'bob,alice'], makeConfig(dir));

    expect(result.success).toBe(true);
    for (const name of ['bob', 'alice']) {
      expect(await exists(dir, `out/${name}/a.ts`)).toBe(true);
      expect(await exists(dir, `out/${name}/b.ts`)).toBe(true);
      expect((await read(dir, `out/${name}/a.ts`)).trim()).toBe(`a for ${name}`);
    }
  });
});

describe('glob: skipIfExists (4.1)', () => {
  beforeEach(() => {
    log = [];
  });

  it('skips an existing target without failing or overwriting it', async () => {
    const dir = await copyFixture();

    const first = await runner(['gl', 'skip', 'foo'], makeConfig(dir));
    expect(first.success).toBe(true);
    expect((await read(dir, 'out/foo.txt')).trim()).toBe('body for foo');

    // tamper with the file to prove the second run leaves it untouched
    await fs.writeFile(path.join(dir, 'out/foo.txt'), 'pre-existing');

    const second = await runner(['gl', 'skip', 'foo'], makeConfig(dir));

    expect(second.success).toBe(true);
    expect(await read(dir, 'out/foo.txt')).toBe('pre-existing');
    expect(second.actions.some((a) => a.status === 'skipped')).toBe(true);
    expect(second.failures ?? []).toHaveLength(0);
  });

  it('keeps going past a skipped action and writes later actions', async () => {
    const dir = await copyFixture();
    await fs.outputFile(path.join(dir, 'out/foo.txt'), 'pre-existing');

    const result = await runner(
      ['gl', 'skip,multi', 'foo', '--keep-going'],
      makeConfig(dir),
    );

    expect(result.success).toBe(true);
    expect(await read(dir, 'out/foo.txt')).toBe('pre-existing');
    expect(await exists(dir, 'out/foo/a.ts')).toBe(true);
    expect(await exists(dir, 'out/foo/b.ts')).toBe(true);
    expect(result.failures ?? []).toHaveLength(0);
  });
});
