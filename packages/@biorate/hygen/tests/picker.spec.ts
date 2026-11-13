import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig, Prompter } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'picker');
const templatesSrc = path.join(fixtureRoot, '_templates');

// Capturing sink so each E2E run can assert exactly what was logged (the
// missing-arguments error text, the "no generators found" guidance, and the
// interactive-picker tip that a TTY is required).
let log: string[] = [];
const logSink = (msg: string) => {
  log.push(msg);
};

/** @description A prompter that answers each select by its question name. */
interface FakePrompter {
  calls: Array<{ name: string } & Record<string, unknown>>;
  createPrompter: RunnerConfig['createPrompter'];
}

/** @description Builds a fake prompter answering `{ <name>: value }` per question. */
const fakePrompter = (answers: Record<string, string>): FakePrompter => {
  const calls: Array<{ name: string } & Record<string, unknown>> = [];
  return {
    calls,
    createPrompter: (() => ({
      prompt: (q: unknown) => {
        calls.push(q as { name: string } & Record<string, unknown>);
        const name = (q as { name: string }).name;
        return Promise.resolve({ [name]: answers[name] });
      },
      // `createPrompter` is generic (`<Q, T>() => Prompter<Q, T>`); a test fake
      // answers with a loose record, which cannot satisfy every instantiation.
    })) as unknown as RunnerConfig['createPrompter'],
  };
};

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  // config-resolver falls back to <cwd>/_templates once the fixture is copied there
  templates: undefined,
  logger: new Logger(logSink),
  debug: false,
  exec: () => undefined,
  createPrompter: () => require('enquirer'),
});

/** @description `interactive: true` config driven by the injected fake prompter. */
const interactiveConfig = (cwd: string, prompter: FakePrompter): RunnerConfig => ({
  ...makeConfig(cwd),
  interactive: true,
  createPrompter: prompter.createPrompter,
});

const copyFixture = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-picker-'));
  await fs.copy(templatesSrc, path.join(dir, '_templates'));
  return dir;
};

/** @description A templates root that exists but holds no eligible generator. */
const makeGeneratorlessTemplates = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-picker-empty-'));
  await fs.outputFile(path.join(dir, '_templates', 'readme.md'), 'nothing here');
  return dir;
};

const read = async (cwd: string, rel: string): Promise<string> =>
  (await fs.readFile(path.join(cwd, rel))).toString();

const exists = (cwd: string, rel: string): Promise<boolean> =>
  fs.pathExists(path.join(cwd, rel));

describe('picker: two-level generator/action selection (spec add-hygen-interactive-picker)', () => {
  beforeEach(() => {
    log = [];
  });

  it('drives the run from a generator+action selection, exactly as if passed positionally', async () => {
    const dirInteractive = await copyFixture();
    const dirPositional = await copyFixture();
    const fake = fakePrompter({ generator: 'pick', action: 'new' });

    const interactive = await runner([], interactiveConfig(dirInteractive, fake));
    const positional = await runner(['pick', 'new'], makeConfig(dirPositional));

    expect(interactive.success).toBe(true);
    // the file was created and the action ran ok
    expect(await exists(dirInteractive, 'out/picked.txt')).toBe(true);
    expect(await read(dirInteractive, 'out/picked.txt')).toBe('picked-body\n');
    expect(interactive.statuses).toEqual([{ action: 'new', status: 'ok' }]);

    // two sequential prompts: generator then action
    expect(fake.calls.map((c) => c.name)).toEqual(['generator', 'action']);

    // byte-identical to passing ['pick','new'] positionally
    expect(positional.success).toBe(true);
    expect(await read(dirPositional, 'out/picked.txt')).toBe(
      await read(dirInteractive, 'out/picked.txt'),
    );
    expect(interactive.statuses).toEqual(positional.statuses);
  });

  it('runs only the single chosen action from a multi-action generator (no multi-select)', async () => {
    const dir = await copyFixture();
    // `pick` has two action directories; select the second one (`second`).
    const fake = fakePrompter({ generator: 'pick', action: 'second' });

    const result = await runner([], interactiveConfig(dir, fake));

    expect(result.success).toBe(true);
    // only `second` ran: its file exists, the first action's file does not
    expect(await exists(dir, 'out/second.txt')).toBe(true);
    expect(await exists(dir, 'out/picked.txt')).toBe(false);
    // exactly one status, for the chosen action: a single selection, no multi-select
    expect(result.statuses).toEqual([{ action: 'second', status: 'ok' }]);
  });

  it('picks among several generators (the chosen generator wins)', async () => {
    const dir = await copyFixture();
    // both `pick` and `other` are eligible generators; picking `other` must run it.
    const fake = fakePrompter({ generator: 'other', action: 'new' });

    const result = await runner([], interactiveConfig(dir, fake));

    expect(result.success).toBe(true);
    expect(await exists(dir, 'out/other.txt')).toBe(true);
    expect(await exists(dir, 'out/picked.txt')).toBe(false);
  });
});

describe('picker: no generators found (spec add-hygen-interactive-picker)', () => {
  beforeEach(() => {
    log = [];
  });

  it('fails with guidance instead of an empty menu and never prompts', async () => {
    const dir = await makeGeneratorlessTemplates();
    const fake = fakePrompter({ generator: 'never', action: 'never' });

    const result = await runner([], interactiveConfig(dir, fake));

    expect(result.success).toBe(false);
    const out = log.join('\n');
    expect(out).toContain('No generators found');
    expect(out).toContain('_templates');
    // the prompter must never receive a `generator` question
    expect(fake.calls).toHaveLength(0);
  });
});

describe('picker: non-interactive fallback (spec add-hygen-interactive-picker)', () => {
  beforeEach(() => {
    log = [];
  });

  it("fails fast with `interactive: false` — no prompt, extended 'requires a TTY' hint", async () => {
    const dir = await copyFixture();
    let promptCalls = 0;
    const config: RunnerConfig = {
      ...makeConfig(dir),
      interactive: false,
      createPrompter: (() => ({
        prompt: () => {
          promptCalls++;
          return Promise.resolve({});
        },
      })) as unknown as RunnerConfig['createPrompter'],
    };

    const result = await runner([], config);

    expect(result.success).toBe(false);
    expect(promptCalls).toBe(0);
    const out = log.join('\n');
    expect(out).toContain('please specify a generator');
    expect(out).toContain('interactive generator/action picker');
    expect(out).toContain('requires a TTY');
  });

  it('fails fast when `interactive` is omitted (non-TTY auto-detect never prompts)', async () => {
    const dir = await copyFixture();
    let promptCalls = 0;
    const config: RunnerConfig = {
      ...makeConfig(dir),
      createPrompter: (() => ({
        prompt: () => {
          promptCalls++;
          return Promise.resolve({});
        },
      })) as unknown as RunnerConfig['createPrompter'],
    };

    const result = await runner([], config);

    expect(result.success).toBe(false);
    expect(promptCalls).toBe(0);
    expect(log.join('\n')).toContain('interactive generator/action picker');
  });
});

describe('picker: flags pass through (spec add-hygen-interactive-picker)', () => {
  beforeEach(() => {
    log = [];
  });

  it('delivers a data flag to the template exactly as if passed positionally', async () => {
    const dirInteractive = await copyFixture();
    const dirPositional = await copyFixture();
    // the data flag is consumed only by the `flag` action
    const fake = fakePrompter({ generator: 'pick', action: 'flag' });

    const interactive = await runner(
      ['--mode', 'fast'],
      interactiveConfig(dirInteractive, fake),
    );
    const positional = await runner(
      ['pick', 'flag', '--mode', 'fast'],
      makeConfig(dirPositional),
    );

    expect(interactive.success).toBe(true);
    expect(positional.success).toBe(true);
    // the data option reached the template in both runs, identically
    expect(await read(dirInteractive, 'out/flag-fast.txt')).toBe('mode=fast\n');
    expect(await read(dirInteractive, 'out/flag-fast.txt')).toBe(
      await read(dirPositional, 'out/flag-fast.txt'),
    );
    expect(interactive.statuses).toEqual(positional.statuses);
  });
});
