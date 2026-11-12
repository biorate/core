import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'skip');
const templatesSrc = path.join(fixtureRoot, '_templates');

// Capturing sinks let an E2E run assert exactly which effects happened: the log
// (skip reasons, transform warnings/errors) and — for `sh:` actions — the shell
// commands actually handed to `exec`. A skipped `sh:` action must never appear.
let log: string[] = [];
const logSink = (msg: string) => {
  log.push(msg);
};
let executed: string[] = [];

const makeConfig = (cwd: string): RunnerConfig => ({
  cwd,
  // config-resolver falls back to <cwd>/_templates once the fixture is copied there
  templates: undefined,
  logger: new Logger(logSink),
  debug: false,
  exec: (sh) => {
    executed.push(sh);
  },
  createPrompter: () => require('enquirer'),
});

const copyFixture = async (): Promise<string> => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-skip-'));
  await fs.copy(templatesSrc, path.join(dir, '_templates'));
  return dir;
};

const read = async (cwd: string, rel: string): Promise<string> =>
  (await fs.readFile(path.join(cwd, rel))).toString();

const exists = (cwd: string, rel: string): Promise<boolean> =>
  fs.pathExists(path.join(cwd, rel));

describe('skip: declarative conditional actions (spec add-hygen-conditional-actions)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('skips a file action with a reason (EJS conditional) — no file, reason logged, status skipped', async () => {
    const dir = await copyFixture();

    // `wantTests` is falsy → the template's `<% if (wantTests) %>` takes its
    // `else` branch, rendering `skip:` to the reason string.
    const result = await runner(['skip', 'cond', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await exists(dir, path.join('out', 'x-cond.txt'))).toBe(false);
    expect(result.statuses).toEqual([
      { action: 'cond', name: 'x', status: 'skipped', reason: 'no tests requested' },
    ]);
    expect(log.join('\n')).toContain('no tests requested');
    expect(result.failures ?? []).toHaveLength(0);
  });

  it('runs the action when the EJS conditional renders the string false', async () => {
    const dir = await copyFixture();

    // `wantTests` truthy → the template's `<% if (wantTests) %>` branch renders
    // the string `false`, which the skip contract treats as "run" (the boolean
    // spelling is recognised case-insensitively even though EJS yields a string).
    const result = await runner(['skip', 'cond', 'x', '--wantTests'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await read(dir, path.join('out', 'x-cond.txt'))).toBe('cond-body-x\n');
    expect(result.statuses).toEqual([{ action: 'cond', name: 'x', status: 'ok' }]);
    expect(log.join('\n')).not.toContain('skipped');
  });

  it('runs the action when the skip value is falsy (empty or literal false)', async () => {
    const dir = await copyFixture();

    // 01-falsy.ejs.t declares `skip: false` (boolean), 02-empty.ejs.t declares
    // `skip: ''`, 03-string-false.ejs.t declares `skip: 'false'` (quoted string) —
    // all are falsy renders (the boolean spelling is coerced), so every action runs.
    const result = await runner(['skip', 'falsy', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await read(dir, path.join('out', 'x-falsy.txt'))).toBe('falsy-body-x\n');
    expect(await read(dir, path.join('out', 'x-empty.txt'))).toBe('empty-body-x\n');
    expect(await read(dir, path.join('out', 'x-string-false.txt'))).toBe(
      'string-false-body-x\n',
    );
    expect(result.statuses).toEqual([
      { action: 'falsy', name: 'x', status: 'ok' },
      { action: 'falsy', name: 'x', status: 'ok' },
      { action: 'falsy', name: 'x', status: 'ok' },
    ]);
    // no skip was reported
    expect(log.join('\n')).not.toContain('skipped');
  });

  it('skips a sh: action without executing the command (exec spy never called)', async () => {
    const dir = await copyFixture();

    const result = await runner(['skip', 'shskip', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(executed).toEqual([]);
    expect(result.statuses).toEqual([
      { action: 'shskip', name: 'x', status: 'skipped', reason: 'no shell today' },
    ]);
    expect(log.join('\n')).toContain('no shell today');
  });

  it('skips an inject action without injecting into the target', async () => {
    const dir = await copyFixture();
    await fs.outputFile(path.join(dir, 'inject', 'target.txt'), 'header');

    const result = await runner(['skip', 'injskip', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    // the pre-existing target is untouched: no injection happened
    expect(await read(dir, path.join('inject', 'target.txt'))).toBe('header');
    expect(result.statuses).toEqual([
      {
        action: 'injskip',
        name: 'x',
        status: 'skipped',
        reason: 'no injection performed',
      },
    ]);
    expect(log.join('\n')).toContain('no injection performed');
  });

  it('skip: true skips without a reason (no reason field, plain log line)', async () => {
    const dir = await copyFixture();

    const result = await runner(['skip', 'true-skip', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await exists(dir, path.join('out', 'x-true.txt'))).toBe(false);
    expect(result.statuses).toEqual([
      { action: 'true-skip', name: 'x', status: 'skipped' },
    ]);
    expect(log.join('\n')).toMatch(/skipped/);
    expect(log.join('\n')).not.toMatch(/skipped: /);
  });
});

describe('skip: three-state result and fail-fast interaction (spec add-hygen-conditional-actions)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('records one skipped + one ok in a single run with an empty failures list', async () => {
    const dir = await copyFixture();

    const result = await runner(['skip', 'mix', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(result.statuses).toEqual([
      { action: 'mix', name: 'x', status: 'skipped', reason: 'mix skip reason' },
      { action: 'mix', name: 'x', status: 'ok' },
    ]);
    // the skipped action produced no operation outcome; only the ok file was written
    expect(result.actions).toHaveLength(1);
    expect(await read(dir, path.join('out', 'x-mix-ok.txt'))).toBe('mix-ok-x\n');
    expect(await exists(dir, path.join('out', 'x-mix-skip.txt'))).toBe(false);
    expect(result.failures ?? []).toHaveLength(0);
  });

  it('does not abort a fail-fast run: a skipped action preceding others lets them run', async () => {
    const dir = await copyFixture();

    // default (fail-fast) run: `mix`'s first action is skipped, the second still executes
    const result = await runner(['skip', 'mix', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(await read(dir, path.join('out', 'x-mix-ok.txt'))).toBe('mix-ok-x\n');
    expect(result.statuses.map((s) => s.status)).toEqual(['skipped', 'ok']);
  });

  it('keeps going past a failed action and distinguishes failed from skipped', async () => {
    const dir = await copyFixture();

    const result = await runner(
      ['skip', 'failing,skiponly', 'x', '--keep-going'],
      makeConfig(dir),
    );

    expect(result.success).toBe(false);
    // failures contains only the failed action — never the skipped one
    expect(result.failures).toHaveLength(1);
    expect(result.failures?.[0]).toMatchObject({ action: 'failing', name: 'x' });
    expect(result.failures?.[0]?.error).toContain('Unknown transform');
    // statuses distinguishes both: failed + skipped
    expect(result.statuses).toEqual([
      { action: 'failing', name: 'x', status: 'failed' },
      { action: 'skiponly', name: 'x', status: 'skipped', reason: 'skip only reason' },
    ]);
    // the skipped action wrote nothing; the failed one wrote nothing either
    expect(await exists(dir, path.join('out', 'x-skiponly.txt'))).toBe(false);
    expect(await exists(dir, path.join('out', 'x-fail.txt'))).toBe(false);
  });
});

describe('skip: glob batch and transform interaction (spec add-hygen-conditional-actions)', () => {
  beforeEach(() => {
    log = [];
    executed = [];
  });

  it('a skip: on a glob spec skips the whole batch — no matched file is written', async () => {
    const dir = await copyFixture();

    const result = await runner(['skip', 'batch', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    // exactly one skipped outcome, carrying the batch reason
    const skipped = result.statuses.filter((s) => s.status === 'skipped');
    expect(skipped).toHaveLength(1);
    expect(skipped[0]).toMatchObject({
      action: 'batch',
      name: 'x',
      reason: 'batch skipped',
    });
    // the whole batch is skipped: no glob op resolved (no operation outcome) and
    // no matched file is written to the batch destination
    expect(result.actions).toHaveLength(0);
    expect(await exists(dir, path.join('out', 'x', 'a.ts'))).toBe(false);
    expect(await exists(dir, path.join('out', 'x', 'b.ts'))).toBe(false);
    expect(log.join('\n')).toContain('batch skipped');
  });

  it('a skipped action with an unknown transform: does not throw and no transform runs', async () => {
    const dir = await copyFixture();

    // `transform: definitelyNonexistent` is intentionally unregistered; the skip
    // short-circuits before transform resolution, so it must not throw.
    const result = await runner(['skip', 'unknowntransform', 'x'], makeConfig(dir));

    expect(result.success).toBe(true);
    expect(result.statuses).toEqual([
      {
        action: 'unknowntransform',
        name: 'x',
        status: 'skipped',
        reason: 'no transform applied',
      },
    ]);
    expect(await exists(dir, path.join('out', 'x-utrans.txt'))).toBe(false);
    expect(log.join('\n')).not.toContain('UnknownTransformError');
  });
});
