/**
 * @description The type of a declared action parameter. Either the name of a
 * built-in registry type, or a function resolving the raw input to the
 * parameter value. */
export type ParamType = 'string' | 'number' | 'boolean' | ((raw: unknown) => unknown);

/**
 * @description A single declared action parameter in the `params` export of a
 * class-based action hook module. The declaration drives flag coercion, prompt
 * generation (for parameters not supplied via flags) and post-prompt
 * validation. */
export interface ParamDescriptor {
  /** @description The parameter (flag) name, also used as the local/args key. */
  name: string;
  /** @description The parameter type: a registry name or a resolver function. */
  type: ParamType;
  /** @description Whether the parameter must be supplied or answered. */
  required?: boolean;
  /** @description Default value used as the prompt's initial answer. */
  default?: unknown;
  /** @description Prompt question text for an unanswered required parameter. */
  message?: string;
}

/** @description The declarative parameter schema exported by a hook module. */
export type ParamsSchema = ParamDescriptor[];
