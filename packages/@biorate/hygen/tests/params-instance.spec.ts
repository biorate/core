import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { runner } from '../src/runner';
import Logger from '../src/logger';
import type { RunnerConfig } from '../src/types';

const fixtureRoot = path.join(__dirname, 'fixtures', 'params-instance');

/** Copies the fixture into a temp dir and runs the generator there. */
const run = async (args: string[], answer: Record<string, unknown> = {}) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hygen-params-instance-'));
  await fs.copy(path.join(fixtureRoot, '_templates'), path.join(dir, '_templates'));
  const logs: string[] = [];
  const questions: string[] = [];
  const config: RunnerConfig = {
    cwd: dir,
    templates: undefined,
    logger: new Logger((msg) => logs.push(msg)), // eslint-disable-line no-console
    debug: false,
    exec: () => undefined,
    createPrompter: () => ({
      prompt: async (q: any) => {
        const list = (Array.isArray(q) ? q : [q]) as { name: string; message?: string }[];
        for (const item of list) questions.push(`${item.name}:${item.message ?? ''}`);
        return answer;
      },
    }),
  };
  const result = await runner(args, config);
  const read = (rel: string) =>
    fs.existsSync(path.join(dir, rel))
      ? fs.readFile(path.join(dir, rel), 'utf8')
      : undefined;
  return { logs, result, questions, read };
};

describe('instance-field params on hooks classes', () => {
  it('resolves an instance-field params schema like the project config form', async () => {
    const { result, read } = await run(['widget', 'new', '--label', 'alpha']);
    expect(result.success).toBe(true);
    expect(await read('output.txt')).toContain('label: alpha');
  });

  it('prompts for a missing required instance-field parameter', async () => {
    const { result, read } = await run(['widget', 'new'], { label: 'from-prompt' });
    expect(result.success).toBe(true);
    expect(await read('output.txt')).toContain('label: from-prompt');
  });

  it('an instance field shadows a legacy static member with a warning', async () => {
    const { logs, questions, read } = await run(['widget', 'shadow'], {
      label: 'x',
    });
    expect(logs.join('\n')).toContain(
      "declares both an instance 'params' field and a legacy 'static params' member",
    );
    // the instance descriptor's message drove the question
    expect(questions).toContain('label:INSTANCE');
    expect(await read('shadow.txt')).toContain('label: [x]');
  });
});
