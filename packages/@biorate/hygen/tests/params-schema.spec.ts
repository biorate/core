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
    expect(values).toEqual({ name: 'widget', count: 2 });
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
    expect(values).toEqual({ title: 'untitled' });
  });
});

describe('params-schema load-time validation', () => {
  it('an unknown string type is rejected with the parameter name', () => {
    expect(() => validateParamsSchema([{ name: 'x', type: 'flaoty' }] as any)).toThrow(
      ParamUnknownTypeError,
    );
  });
});
