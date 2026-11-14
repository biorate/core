import type { ParamDescriptor, ParamsSchema, Prompter } from '../types';
import { coerceParam, promptTypeOf, validateParams } from './registry';

/** @description A minimal schema question rendered by any prompter. */
interface ParamQuestion {
  type: string;
  name: string;
  message: string;
  initial?: unknown;
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
    questions.push({
      type: promptTypeOf(descriptor),
      name: descriptor.name,
      message: descriptor.message ?? `Enter a value for ${descriptor.name}:`,
      ...(descriptor.default !== undefined ? { initial: descriptor.default } : {}),
    });
  }

  if (questions.length > 0) {
    const prompter = createPrompter();
    const answers = await prompter.prompt(questions as unknown as Q);
    const answerMap = (answers ?? {}) as Record<string, unknown>;
    for (const question of questions) {
      const answered = answerMap[question.name];
      values[question.name] = answered !== undefined ? answered : question.initial;
    }
  }

  return validateParams(schema, values);
};
