import path from 'path';
import { HookModuleError } from '../src/errors';
import Logger from '../src/logger';
import prompt, { resolveActionHooks } from '../src/prompt';
import type { HookCache } from '../src/types';
import { render } from '../src/render';

const fixture = (...segments: string[]) =>
  path.join(__dirname, 'fixtures', 'hooks-resolve', ...segments);

const logger = new Logger(() => undefined); // eslint-disable-line @typescript-eslint/no-empty-function

const makePrompter = () => ({
  prompt: async (questions: unknown) => {
    const question = (Array.isArray(questions) ? questions[0] : questions) as
      | { name?: string }
      | undefined;
    return { [question?.name ?? 'answer']: 'answered' } as Record<string, unknown>;
  },
});

describe('action hook resolution', () => {
  it('prefers hooks.ts over a legacy prompt.js', async () => {
    const resolved = await resolveActionHooks(fixture('priority', 'demo', 'new'));

    expect(resolved.kind).toBe('class');
    expect(resolved.file?.endsWith('hooks.ts')).toBe(true);
    expect(resolved.instance).not.toHaveProperty('beforeEach');
    await expect(
      resolved.instance.prompt!({
        prompter: makePrompter(),
        args: {},
        h: {},
      }),
    ).resolves.toEqual({ componentName: 'from-hooks' });
  });

  it.each(['formats-js', 'formats-mjs', 'formats-cjs'])(
    'loads a class from %s',
    async (dir) => {
      const resolved = await resolveActionHooks(fixture(dir, 'demo', 'new'));

      expect(resolved.kind).toBe('class');
      expect(typeof resolved.instance.beforeAll).toBe('function');
    },
  );

  it('adapts a legacy prompt.js to the prompt-only contract', async () => {
    const resolved = await resolveActionHooks(fixture('legacy', 'demo', 'new'));

    expect(resolved.kind).toBe('legacy');
    expect(resolved.instance.beforeAll).toBeUndefined();
    expect(resolved.instance.beforeEach).toBeUndefined();
    expect(resolved.instance.afterEach).toBeUndefined();
    expect(resolved.instance.afterAll).toBeUndefined();
    await expect(
      prompt(() => makePrompter(), fixture('legacy', 'demo', 'new'), { name: 'widget' }),
    ).resolves.toEqual({ fromLegacy: 'widget' });
  });

  it('keeps the legacy question-array form working', async () => {
    const asked: string[] = [];
    const prompter = {
      prompt: async (questions: unknown) => {
        const question = (Array.isArray(questions) ? questions[0] : questions) as {
          name: string;
        };
        asked.push(question.name);
        return { [question.name]: 'answered' };
      },
    };

    await expect(
      prompt(() => prompter, fixture('legacy-index', 'demo', 'new'), {}),
    ).resolves.toEqual({ componentName: 'answered' });
    expect(asked).toEqual(['componentName']);
  });

  it('resolves to an empty object when the action has no hook file', async () => {
    const resolved = await resolveActionHooks(fixture('none', 'demo', 'new'));

    expect(resolved.kind).toBe('none');
    await expect(
      prompt(() => makePrompter(), fixture('none', 'demo', 'new'), {}),
    ).resolves.toEqual({});
  });

  it.each(['invalid-object', 'invalid-fn', 'invalid-none'])(
    'rejects %s with HookModuleError',
    async (dir) => {
      const folder = fixture(dir, 'demo', 'new');

      await expect(resolveActionHooks(folder)).rejects.toBeInstanceOf(HookModuleError);
      await expect(resolveActionHooks(folder)).rejects.toThrow(folder);
    },
  );

  it('caches one instance per action folder for a run', async () => {
    const cache: HookCache = new Map();
    const first = await resolveActionHooks(fixture('formats-js', 'demo', 'new'), cache);
    const second = await resolveActionHooks(fixture('formats-js', 'demo', 'new'), cache);

    expect(second.instance).toBe(first.instance);
    expect(cache.size).toBe(1);
  });

  it('returns a fresh instance when no cache is supplied', async () => {
    const first = await resolveActionHooks(fixture('formats-js', 'demo', 'new'));
    const second = await resolveActionHooks(fixture('formats-js', 'demo', 'new'));

    expect(second.instance).not.toBe(first.instance);
  });
});

describe('class prompt section', () => {
  it('supplies template variables for rendering', async () => {
    const folder = fixture('prompt-section', 'demo', 'new');
    const answers = (await prompt(
      () => makePrompter(),
      folder,
      {},
      { h: { h: {} } },
    )) as Record<string, unknown>;
    const rendered = await render(
      {
        ...answers,
        actionfolder: folder,
        templates: fixture('prompt-section'),
        generator: 'demo',
        action: 'new',
      },
      { logger },
    );

    expect(rendered).toHaveLength(1);
    expect(rendered[0].attributes.to).toBe('button.txt');
    expect(rendered[0].body.trim()).toBe('button');
  });
});
