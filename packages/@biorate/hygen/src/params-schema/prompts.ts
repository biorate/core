import type { ParamDescriptor, ParamsSchema, Prompter } from '../types';
import { coerceParam, isEmptyValue, promptTypeOf, validateParams } from './registry';

/** @description A minimal schema question rendered by any prompter. */
interface ParamQuestion {
  type: string;
  name: string;
  message: string;
  initial?: unknown;
  /** @description Enquirer contract: return `true` to accept, a string to re-ask with that warning. */
  validate?: (value: unknown) => boolean | string;
}

/**
 * @description Runs the schema-driven parameter phase for one pair: coerces the
 * flag values already supplied in `args`, prompts once for each required
 * parameter that is still absent (already-supplied parameters are never asked
 * again), and validates the merged values. Defaults act as the prompt's initial
 * answer; parameters that stay absent are simply not returned.
 * @param schema - The action's validated `params` schema.
 * @param createPrompter - Factory producing the prompter.
 * @param args - The CLI-supplied arguments (already includes `cleanArgv`).
 * @returns The coerced/answered parameter values for the pair's locals. */
export const promptFromParams = async <Q, T>(
  schema: ParamsSchema,
  createPrompter: () => Prompter<Q, T>,
  args: Record<string, any>,
): Promise<Record<string, unknown>> => {
  const values: Record<string, unknown> = {};
  const questions: ParamQuestion[] = [];

  for (const descriptor of schema as ParamDescriptor[]) {
    const raw = args[descriptor.name];
    if (raw !== undefined) {
      values[descriptor.name] = coerceParam(descriptor, raw);
      continue;
    }
    if (!descriptor.required) continue;
    const question: ParamQuestion = {
      type: promptTypeOf(descriptor),
      name: descriptor.name,
      message: descriptor.message ?? `Enter a value for ${descriptor.name}:`,
      ...(descriptor.default !== undefined ? { initial: descriptor.default } : {}),
    };
    // Enquirer re-renders the question when `validate` returns a string, so an
    // empty Enter on a required input/numeral warns and re-asks in place.
    // Boolean (`confirm`) questions are excluded: an empty confirm resolves to
    // its default and re-asking would be pointless.
    if (question.type !== 'confirm') {
      question.validate = (value: unknown) =>
        !isEmptyValue(value) || `Field "${descriptor.name}" is required`;
    }
    questions.push(question);
  }

  if (questions.length > 0) {
    const prompter = createPrompter();
    const answers = await prompter.prompt(questions as unknown as Q);
    const answerMap = (answers ?? {}) as Record<string, unknown>;
    for (const question of questions) {
      const answered = answerMap[question.name];
      // An empty confirm answer resolves to `false` (enquirer's Enter default);
      // other types fall back to the question's initial (default) value.
      values[question.name] =
        answered !== undefined
          ? answered
          : question.type === 'confirm'
          ? false
          : question.initial;
    }
  }

  return validateParams(schema, values);
};
