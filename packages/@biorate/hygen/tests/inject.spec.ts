import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src';
import Logger from '../src/logger';
import inject from '../src/ops/inject';
import { InjectionAnchorNotFoundError } from '../src/errors';
import type { RenderedAction, RunnerConfig } from '../src/types';

describe('inject', () => {
  it('an unfound anchor in the inject op throws and leaves the file untouched', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-inject-'));
    const target = 'target.txt';
    const original = 'line1\nline2\n';
    await fs.writeFile(path.join(dir, target), original);

    const config = {
      cwd: dir,
      logger: new Logger(console.log), // eslint-disable-line no-console
      debug: false,
      exec: () => undefined,
      createPrompter: () => require('enquirer'),
    } as RunnerConfig;

    const action: RenderedAction = {
      attributes: { to: target, inject: true, after: 'NO_SUCH_ANCHOR' },
      body: 'injected',
    };

    await expect(inject(action, {}, config)).rejects.toThrow(
      InjectionAnchorNotFoundError,
    );
    // The file is never written when the anchor is missing.
    expect((await fs.readFile(path.join(dir, target))).toString()).toBe(original);
  });

  it('an unfound anchor surfaces as RunnerResult.success === false (bug #404 fixed)', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-inject-err-'));
    const target = path.join(dir, 'app', 'target.txt');
    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, 'line1\nline2\n');

    const config = {
      cwd: dir,
      templates: path.join(__dirname, 'fixtures', 'inject-error', '_templates'),
      logger: new Logger(console.log), // eslint-disable-line no-console
      debug: false,
      exec: () => undefined,
      createPrompter: () => require('enquirer'),
    } as RunnerConfig;

    const result = await runner(['app', 'new'], config);
    expect(result.success).toBe(false);
    expect((await fs.readFile(target)).toString()).toBe('line1\nline2\n');
  });

  it('create_if_missing creates the missing target with the body (5.1)', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-create-'));
    const target = 'new-target.txt';

    const config = {
      cwd: dir,
      logger: new Logger(console.log), // eslint-disable-line no-console
      debug: false,
      exec: () => undefined,
      createPrompter: () => require('enquirer'),
    } as RunnerConfig;

    const action: RenderedAction = {
      attributes: {
        to: target,
        inject: true,
        create_if_missing: true,
        append: true,
        skip_if: 'create-missing-marker',
      },
      body: 'create-missing-marker = true;',
    };

    await inject(action, {}, config);
    expect(await fs.pathExists(path.join(dir, target))).toBe(true);
    expect((await fs.readFile(path.join(dir, target))).toString()).toContain(
      'create-missing-marker = true;',
    );
  });

  it('without create_if_missing a missing target stays an operation error (5.1)', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-no-create-'));
    const target = 'missing-target.txt';

    const config = {
      cwd: dir,
      logger: new Logger(console.log), // eslint-disable-line no-console
      debug: false,
      exec: () => undefined,
      createPrompter: () => require('enquirer'),
    } as RunnerConfig;

    const action: RenderedAction = {
      attributes: { to: target, inject: true, append: true },
      body: 'never-landed',
    };

    const result = await inject(action, {}, config);
    expect(result.status).toBe('error');
    expect(await fs.pathExists(path.join(dir, target))).toBe(false);
  });
});
