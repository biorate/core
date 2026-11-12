import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'transform');
const templatesSrc = path.join(fixtureRoot, '_templates');

// The `transform:` feature drives two observable outputs besides written files:
// the run log (unknown-name errors / `sh:`-ignored warnings) and, for `sh:`
// actions, the shell commands handed to `exec`. Capturing both lets the E2E
// assert that transforms run, warn or fail exactly when declared.
let log: string[] = [];
const logSink = (msg: string) => {
  log.push(msg);
};
let executed: string[] = [];

// `transforms` come from the fixture's `.hygen.js`, merged by the config
// resolver (nearest-directory walk from `cwd` up). Copying it alongside the
// `_templates` folder makes the resolver pick it up in a real run.
const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  templates: undefined,
  logger: new Logger(logSink),
  debug: false,
  exec: (sh) => {
    executed.push(sh);
  },
  createPrompter: () => require('enquirer'),
});

const copyFixture = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-transform-'));
  await fs.copy(templatesSrc, path.join(dir, '_templates'));
  await fs.copy(path.join(fixtureRoot, '.hygen.js'), path.join(dir, '.hygen.js'));
  return dir;
};

const read = async (cwd: string, rel: string): Promise<string> =>
  (await fs.readFile(path.join(cwd, rel))).toString();

describe('transform: named content transforms (spec 5.1)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('rewrites content through a single transform before writing', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'add', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    const content = await read(dir, path.join('out', 'x-add.txt'));
    expect(content.startsWith('// prettier-run')).toBe(true);
    expect(content).toContain('add-x');
  });

  it('applies chained transforms left-to-right, each seeing the previous output', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'chained', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    const content = await read(dir, path.join('out', 'x-chained.txt'));
    // stripLicense ran first (dropping the license line), then prettier ran on
    // that output. A reversed order would leave the license comment above the
    // prettier marker, so its absence proves the declared order is honoured.
    expect(content.startsWith('// prettier-run')).toBe(true);
    expect(content).toContain('body-x');
    expect(content).not.toContain('license');
  });

  it('awaits an async transform and passes the run locals', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'async', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    expect((await read(dir, path.join('out', 'x-async.txt'))).trim()).toBe('async-x::x');
  });

  it('fails the action with a typed UnknownTransformError in the run log', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'unknown', 'x'], makeConfig(dir));
    expect(result.success).toBe(false);
    expect(result.failures).toBeUndefined();

    const text = log.join('\n');
    expect(text).toContain('UnknownTransformError');
    expect(text).toContain('Unknown transform [nonexistent]');
  });
});

describe('transform: applies to every file-producing target (spec 5.1/5.2)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('transforms a mirrored template body before the mirror target is written', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'mir', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    // mirror target = template path relative to the action folder, `.t` stripped
    const content = await read(dir, path.join('parts', 'header.ejs'));
    expect(content.startsWith('// prettier-run')).toBe(true);
    expect(content).toContain('header x');
  });

  it('transforms the body injected into an existing target', async () => {
    const dir = await copyFixture();
    await fs.outputFile(path.join(dir, 'inject', 'target.txt'), 'header');

    const result = await runner(['tr', 'inject', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    const content = await read(dir, path.join('inject', 'target.txt'));
    expect(content).toContain('// prettier-run');
    expect(content).toContain('injected-x');
  });
});

describe('transform: sh: actions and the ignore/no-op paths (spec 5.2)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('warns and ignores transform for a sh: action while the command still runs', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'sh-warn', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    // the command was handed to `exec` (it still ran) ...
    expect(executed).toEqual(['echo hello-from-sh']);
    // ... and a warning named the ignored attribute was emitted
    expect(log.join('\n')).toContain('is ignored for sh: action');
  });

  it('emits no warnings for a shell-only action without transform:', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'sh-only', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    expect(executed).toEqual(['echo hello-only']);
    // no transform resolution happened, so no `transform`-related warning appears
    expect(log.join('\n')).not.toMatch(/ignored for sh/);
  });

  it('leaves a template without transform untouched (no resolution, no warnings)', async () => {
    const dir = await copyFixture();

    const result = await runner(['tr', 'plain', 'x'], makeConfig(dir));
    expect(result.success).toBe(true);

    expect((await read(dir, path.join('out', 'x-plain.txt'))).trim()).toBe('plain-x');
    expect(log.join('\n')).not.toMatch(/transform/);
  });
});

describe('transform: failing transforms under keep-going (spec 5.1)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('collects a throwing transform into failures while partial actions run', async () => {
    const dir = await copyFixture();

    const result = await runner(
      ['tr', 'throw,plain', 'x', '--keep-going'],
      makeConfig(dir),
    );
    expect(result.success).toBe(false);

    expect(result.failures).toHaveLength(1);
    expect(result.failures?.[0]).toMatchObject({ action: 'throw', name: 'x' });
    expect(result.failures?.[0]?.error).toContain('transform boom');

    // the following action still ran and produced its output
    expect(result.actions).toHaveLength(1);
    expect((await read(dir, path.join('out', 'x-plain.txt'))).trim()).toBe('plain-x');
  });
});
