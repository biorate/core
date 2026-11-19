import { coerceParam, promptTypeOf, validateParams } from '../src/params-schema/registry';
import { promptFromParams } from '../src/params-schema/prompts';
import {
  ParamCoercionError,
  ParamRequiredError,
  ParamUnknownTypeError,
} from '../src/errors';
import { validateParamsSchema } from '../src/prompt';
import type { ParamDescriptor, Prompter } from '../src/types';

const stubPrompter = (answers: Record<string, unknown>): Prompter<any, any> => ({
  prompt: async (questions: any) => {
    // record which questions were asked so tests can assert on them
    (globalThis as { __asked?: string[] }).__asked = (
      questions as { name: string }[]
    ).map((q) => q.name);
    return answers;
  },
});

describe('params-schema registry', () => {
  it('coerces numeric strings to numbers and passes native values through', () => {
    const d: ParamDescriptor = { name: 'count', type: 'number' };
    expect(coerceParam(d, '5')).toBe(5);
    expect(coerceParam(d, 5)).toBe(5);
  });

  it('fails numeric coercion naming the parameter and the type', () => {
    const d: ParamDescriptor = { name: 'count', type: 'number' };
    expect(() => coerceParam(d, 'abc')).toThrow(ParamCoercionError);
    expect(() => coerceParam(d, 'abc')).toThrow(/count.*number/s);
  });

  it('coerces boolean spellings and rejects other strings', () => {
    const d: ParamDescriptor = { name: 'dry', type: 'boolean' };
    expect(coerceParam(d, 'true')).toBe(true);
    expect(coerceParam(d, false)).toBe(false);
    expect(() => coerceParam(d, 'maybe')).toThrow(ParamCoercionError);
  });

  it('string coercion stringifies numbers and booleans', () => {
    const d: ParamDescriptor = { name: 'label', type: 'string' };
    expect(coerceParam(d, 42)).toBe('42');
    expect(coerceParam(d, true)).toBe('true');
    expect(coerceParam(d, 'x-y')).toBe('x-y');
  });

  it('function types resolve the value to their result', () => {
    const d: ParamDescriptor = { name: 'stamp', type: (raw) => new Date(String(raw)) };
    const value = coerceParam(d, '2026-01-01') as Date;
    expect(value).toBeInstanceOf(Date);
    expect(value.toISOString()).toContain('2026-01-01');
  });

  it('prompt types map to input kinds', () => {
    expect(promptTypeOf({ name: 'a', type: 'string' })).toBe('input');
    expect(promptTypeOf({ name: 'b', type: 'number' })).toBe('numeral');
    expect(promptTypeOf({ name: 'c', type: 'boolean' })).toBe('confirm');
    expect(promptTypeOf({ name: 'd', type: (raw) => raw })).toBe('input');
  });

  it('validation fails for a required parameter that is absent', () => {
    const schema: ParamDescriptor[] = [{ name: 'name', type: 'string', required: true }];
    expect(() => validateParams(schema, {})).toThrow(ParamRequiredError);
    expect(() => validateParams(schema, { name: 'x' })).not.toThrow();
  });

  it('a required parameter with an empty or whitespace-only value fails', () => {
    const schema: ParamDescriptor[] = [{ name: 'name', type: 'string', required: true }];
    expect(() => validateParams(schema, { name: '' })).toThrow(ParamRequiredError);
    expect(() => validateParams(schema, { name: '   ' })).toThrow(ParamRequiredError);
  });

  it('a required boolean accepts its answered value without the empty rule', () => {
    const schema: ParamDescriptor[] = [{ name: 'dry', type: 'boolean', required: true }];
    expect(() => validateParams(schema, { dry: false })).not.toThrow();
    expect(() => validateParams(schema, {})).not.toThrow();
  });

  it('a non-required parameter accepts an empty value', () => {
    const schema: ParamDescriptor[] = [{ name: 'label', type: 'string' }];
    expect(validateParams(schema, { label: '' })).toEqual({ label: '' });
    expect(validateParams(schema, {})).toEqual({});
  });

  it('validation rejects a value that does not match the declared type', () => {
    const schema: ParamDescriptor[] = [{ name: 'count', type: 'number' }];
    expect(() => validateParams(schema, { count: 'abc' })).toThrow(ParamCoercionError);
  });
});

describe('params-schema prompting', () => {
  it('prompts only for missing required parameters and merges the answers', async () => {
    const schema: ParamDescriptor[] = [
      { name: 'name', type: 'string', required: true, message: 'Component name?' },
      { name: 'count', type: 'number' },
    ];
    const values = await promptFromParams(
      schema,
      () => stubPrompter({ name: 'widget' }),
      { count: 2 },
    );
    expect((globalThis as { __asked?: string[] }).__asked).toEqual(['name']);
    expect(values).toEqual({ name: 'widget', NAME: 'widget', count: 2, COUNT: 2 });
  });

  it('uses the descriptor message and default as the question shape', async () => {
    const schema: ParamDescriptor[] = [
      {
        name: 'title',
        type: 'string',
        required: true,
        message: 'Title?',
        default: 'untitled',
      },
    ];
    let captured: any;
    const prompter: Prompter<any, any> = {
      prompt: async (q: any) => {
        captured = q;
        return {};
      },
    };
    await promptFromParams(schema, () => prompter, {});
    expect(captured[0].message).toBe('Title?');
    expect(captured[0].initial).toBe('untitled');
  });

  it('a required parameter left unanswered without a default fails', async () => {
    const schema: ParamDescriptor[] = [{ name: 'name', type: 'string', required: true }];
    await expect(promptFromParams(schema, () => stubPrompter({}), {})).rejects.toThrow(
      ParamRequiredError,
    );
  });

  it('an answered required parameter with a default fallback validates', async () => {
    const schema: ParamDescriptor[] = [
      { name: 'title', type: 'string', required: true, default: 'untitled' },
    ];
    const values = await promptFromParams(schema, () => stubPrompter({}), {});
    expect(values).toEqual({ title: 'untitled', TITLE: 'untitled' });
  });

  it('required string/number questions carry an empty-value validator; confirm does not', async () => {
    const captures: any[] = [];
    const prompter: Prompter<any, any> = {
      prompt: async (q: any) => {
        captures.push(...(q as any[]));
        return { name: 'a', count: 1, dry: true };
      },
    };
    const schema: ParamDescriptor[] = [
      { name: 'name', type: 'string', required: true },
      { name: 'count', type: 'number', required: true },
      { name: 'dry', type: 'boolean', required: true },
    ];
    await promptFromParams(schema, () => prompter, {});
    expect(captures.map((q) => q.name)).toEqual(['name', 'count', 'dry']);
    expect(captures[0].validate('  ')).toBe('Field "name" is required');
    expect(captures[0].validate('ok')).toBe(true);
    expect(captures[1].validate('')).toBe('Field "count" is required');
    expect(captures[1].validate(0)).toBe(true);
    expect(captures[2].validate).toBeUndefined();
  });

  it('an empty Enter on a required string parameter is re-asked until a value arrives', async () => {
    const schema: ParamDescriptor[] = [
      { name: 'name', type: 'string', required: true, message: 'Component name?' },
    ];
    // A prompter emulating enquirer's validate contract: re-ask while the
    // validator returns a warning string, then hand the value over.
    let calls = 0;
    const askedNames: string[] = [];
    const prompter: Prompter<any, any> = {
      prompt: async (q: any) => {
        const question = (q as any[])[0];
        for (;;) {
          calls += 1;
          askedNames.push(question.name);
          const answer = calls === 1 ? '' : 'widget';
          const verdict = question.validate ? question.validate(answer) : true;
          if (verdict === true) return { [question.name]: answer };
        }
      },
    };
    const values = await promptFromParams(schema, () => prompter, {});
    expect(calls).toBe(2);
    expect(askedNames).toEqual(['name', 'name']);
    expect(values).toEqual({ name: 'widget', NAME: 'widget' });
  });

  it('a re-asked required question preserves message and default', async () => {
    const schema: ParamDescriptor[] = [
      {
        name: 'title',
        type: 'string',
        required: true,
        message: 'Title?',
        default: 'untitled',
      },
    ];
    const shapes: any[] = [];
    const prompter: Prompter<any, any> = {
      prompt: async (q: any) => {
        shapes.push(...(q as any[]));
        return {};
      },
    };
    // The merge falls back to `initial`, so the run completes with the default.
    const values = await promptFromParams(schema, () => prompter, {});
    expect(shapes[0].message).toBe('Title?');
    expect(shapes[0].initial).toBe('untitled');
    expect(shapes[0].validate('  ')).toBe('Field "title" is required');
    expect(values).toEqual({ title: 'untitled', TITLE: 'untitled' });
  });

  it('an empty confirm answer on a required boolean resolves to false', async () => {
    const schema: ParamDescriptor[] = [{ name: 'dry', type: 'boolean', required: true }];
    const values = await promptFromParams(schema, () => stubPrompter({}), {});
    expect(values).toEqual({ dry: false, DRY: false });
  });

  it('a descriptor resolves its value under the upper-underscore alias of its name', async () => {
    const schema: ParamDescriptor[] = [
      { name: 'root', type: 'string', required: true },
      { name: 'app-name', type: 'string' },
    ];
    // args as they arrive from the parse phase under `argCase: 'upper-underscore'`
    const values = await promptFromParams(schema, () => stubPrompter({}), {
      ROOT: '/srv',
      APP_NAME: 'demo',
    });
    expect(values).toEqual({
      root: '/srv',
      ROOT: '/srv',
      'app-name': 'demo',
      APP_NAME: 'demo',
    });
  });
});

describe('params-schema load-time validation', () => {
  it('an unknown string type is rejected with the parameter name', () => {
    expect(() => validateParamsSchema([{ name: 'x', type: 'flaoty' }] as any)).toThrow(
      ParamUnknownTypeError,
    );
  });
});
