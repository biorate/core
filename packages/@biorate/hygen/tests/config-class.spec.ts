import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';
import { runner } from '../src';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const classFixtureRoot = path.join(__dirname, 'fixtures', 'config-class');
const defaultObjectFixtureRoot = path.join(
  __dirname,
  'fixtures',
  'config-default-object',
);

/**
 * Copies a fixture (templates + project config file) into a temp dir and runs
 * the generator there — a real end-to-end resolution through the config family.
 */
const runInTemp = async (fixtureRoot: string, configName: string, args: string[]) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-config-class-'));
  await fs.copy(path.join(fixtureRoot, '_templates'), path.join(dir, '_templates'));
  await fs.copy(path.join(fixtureRoot, configName), path.join(dir, configName));
  const logs: string[] = [];
  const config: RunnerConfig = {
    cwd: dir,
    templates: undefined,
    logger: new Logger((msg) => logs.push(msg)), // eslint-disable-line no-console
    debug: false,
    exec: (sh, body) =>
      execa.command(sh, {
        shell: true,
        cwd: dir,
        ...(body ? { input: body } : {}),
      }),
    createPrompter: () => require('enquirer'),
  };
  const result = await runner(args, config);
  return { dir, logs, result };
};

describe('default-exported project config forms', () => {
  it('resolves a default-exported class: helpers, hooks and unknown-property warning', async () => {
    const { dir, logs, result } = await runInTemp(classFixtureRoot, '.hygen.ts', [
      'klass',
      'new',
      'value',
    ]);
    expect(result.success).toBe(true);
    // The `fromClass` helper is exported only by the class config's `helpers`
    // field, so its presence proves the class was instantiated and resolved.
    const content = (await fs.readFile(path.join(dir, 'klass', 'result.txt'))).toString();
    expect(content).toContain('class:value');
    // Project hooks declared on the class apply to the run.
    expect(logs.join('\n')).toContain('CLASS_HOOK_RAN');
    // Unknown own properties are warned about and never reach the config.
    expect(logs.join('\n')).toContain("unknown project config property 'bogus'");
    expect(
      (result.actions as unknown[]).length === 0 ||
        !JSON.stringify(result.actions).includes('bogus'),
    ).toBe(true);
  });

  it('resolves a default-exported plain object (previously broken)', async () => {
    const { dir, result } = await runInTemp(defaultObjectFixtureRoot, '.hygen.mjs', [
      'deft',
      'new',
      'value',
    ]);
    expect(result.success).toBe(true);
    const content = (await fs.readFile(path.join(dir, 'deft', 'result.txt'))).toString();
    // Regression: `export default { ... }` used to collapse into a stray
    // `default` key; its fields must now merge into the run.
    expect(content).toContain('default:value');
  });
});
