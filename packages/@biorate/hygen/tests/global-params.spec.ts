import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'global-params');

/**
 * Copies the fixture templates into a temp dir and runs the generator there.
 * Global params are passed via `configExtra.params` (embedder form) unless a
 * `.hygen.ts` config file is copied into the temp dir.
 */
const run = async (
  args: string[],
  {
    configExtra = {},
    withConfigFile = false,
    argCase,
  }: {
    configExtra?: Partial<RunnerConfig>;
    withConfigFile?: boolean;
    argCase?: 'keep' | 'upper-underscore';
  } = {},
) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-global-params-'));
  await fs.copy(path.join(fixtureRoot, '_templates'), path.join(dir, '_templates'));
  if (withConfigFile) {
    await fs.copy(path.join(fixtureRoot, '.hygen.ts'), path.join(dir, '.hygen.ts'));
  }
  const logs: string[] = [];
  const promptCalls: string[] = [];
  const config: RunnerConfig = {
    cwd: dir,
    templates: undefined,
    logger: new Logger((msg) => logs.push(msg)), // eslint-disable-line no-console
    debug: false,
    exec: () => undefined,
    createPrompter: () => ({
      prompt: async (questions: any) => {
        const list = (Array.isArray(questions) ? questions : [questions]) as {
          name: string;
        }[];
        for (const q of list) promptCalls.push(q.name);
        return { root: 'global-root', extra: 'e1', ...{} };
      },
    }),
    ...(argCase ? { argCase } : {}),
    ...configExtra,
  };
  const result = await runner(args, config);
  const read = (rel: string) =>
    fs.existsSync(path.join(dir, rel))
      ? fs.readFile(path.join(dir, rel), 'utf8')
      : undefined;
  return { dir, logs, result, promptCalls, read };
};

describe('global declarative params schema', () => {
  it('prompts a required global parameter exactly once across a multi-pair run', async () => {
    const { promptCalls, read } = await run(['gen', 'first,second', 'x'], {
      configExtra: {
        params: [{ name: 'root', type: 'string', required: true }],
      },
    });
    // 'root' asked once for the whole run; 'extra' is the first action's own.
    expect(promptCalls.filter((n) => n === 'root')).toEqual(['root']);
    expect((await read('out/first.txt'))!).toContain('root=[global-root] extra=[e1]');
    expect((await read('out/second.txt'))!).toContain('root=[global-root]');
  });

  it('does not ask a global parameter supplied as a flag', async () => {
    const { promptCalls, read } = await run(
      ['gen', 'first,second', 'x', '--root', '/srv'],
      {
        configExtra: {
          params: [{ name: 'root', type: 'string', required: true }],
        },
      },
    );
    expect(promptCalls).not.toContain('root');
    expect((await read('out/second.txt'))!).toContain('root=[/srv]');
  });

  it('lets the action descriptor shadow the global one with a warning', async () => {
    const { logs, read } = await run(['gen', 'first,second', 'x'], {
      configExtra: {
        params: [{ name: 'root', type: 'string', required: true }],
      },
    });
    expect(logs.join('\n')).toContain("Parameter 'root' is declared both globally");
    // The second action's own (non-required) descriptor drove its phase; the
    // value still arrives from the run-level global answer in args.
    expect((await read('out/second.txt'))!).toContain('root=[global-root]');
  });

  it('resolves a global parameter under the upper-underscore argCase alias', async () => {
    const { read } = await run(['gen', 'second', 'x', '--root', '/srv'], {
      configExtra: {
        params: [{ name: 'root', type: 'string', required: true }],
        argCase: 'upper-underscore',
      },
    });
    // templates see the value under both the declared and normalized keys
    expect((await read('out/second.txt'))!).toContain('root=[/srv]');
  });

  it('fails a whitespace-only global flag with ParamRequiredError', async () => {
    const { logs } = await run(['gen', 'first', 'x', '--root', '  '], {
      configExtra: {
        params: [{ name: 'root', type: 'string', required: true }],
      },
    });
    expect(logs.join('\n')).toContain('ParamRequiredError');
    expect(logs.join('\n')).toContain("'--root' is required");
  });

  it('loads a global params schema from a .hygen.ts project config', async () => {
    const { promptCalls, read, logs } = await run(['gen', 'second', 'x'], {
      withConfigFile: true,
    });
    expect(logs.join('\n')).not.toContain('unknown project config property');
    expect(promptCalls.filter((n) => n === 'root')).toEqual(['root']);
    expect((await read('out/second.txt'))!).toContain('root=[global-root]');
  });

  it('carries params through the HygenConfig base-class conversion', () => {
    const { HygenConfig } = require('../src/hygen-config');
    class Config extends HygenConfig {
      params = [{ name: 'root', type: 'string', required: true }];
    }
    const converted = new Config().toRunnerConfig();
    expect(converted.params).toEqual([{ name: 'root', type: 'string', required: true }]);
  });

  it('leaves a run without a global schema unchanged', async () => {
    const { promptCalls, read } = await run(['gen', 'first', 'x'], {});
    expect(promptCalls).toEqual(['extra']);
    expect((await read('out/first.txt'))!).toContain('root=[none] extra=[e1]');
  });

  it('validates the global schema at resolution time (unknown type fails)', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-global-params-'));
    await fs.copy(path.join(fixtureRoot, '_templates'), path.join(dir, '_templates'));
    await fs.writeFile(
      path.join(dir, '.hygen.ts'),
      "export default { params: [{ name: 'x', type: 'flaoty' }] };\n",
    );
    const logs: string[] = [];
    await expect(
      runner(['gen', 'second', 'x'], {
        cwd: dir,
        templates: undefined,
        logger: new Logger((msg) => logs.push(msg)), // eslint-disable-line no-console
        debug: false,
        exec: () => undefined,
        createPrompter: () => ({ prompt: async () => ({}) }),
      } as RunnerConfig),
    ).rejects.toThrow('flaoty');
  });
});
