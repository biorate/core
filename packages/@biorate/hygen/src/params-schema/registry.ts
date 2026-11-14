import type { ParamDescriptor, ParamType } from '../types';
import { ParamCoercionError, ParamRequiredError, ParamUnknownTypeError } from '../errors';

/**
 * @description The per-type entry of the internal registry: how to coerce a raw
 * input to the type, how to check a (possibly prompt-answered) value, and what
 * prompt input kind the type maps to. */
interface TypeDef {
  /** @description Coerce a raw CLI value; throws when the raw input is not coercible. */
  coerce: (raw: unknown) => unknown;
  /** @description Post-coercion / post-prompt value check. */
  check: (value: unknown) => boolean;
  /** @description The prompt input kind a prompter is expected to render. */
  promptType: string;
}

const BUILTIN_TYPES: Record<string, TypeDef> = {
  string: {
    coerce: (raw) => {
      if (typeof raw === 'string') return raw;
      if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
      throw new Error(String(raw));
    },
    check: (value) => typeof value === 'string',
    promptType: 'input',
  },
  number: {
    coerce: (raw) => {
      if (typeof raw === 'number') return raw;
      // yargs-parser may already have produced a number; a numeric string is
      // coerced; anything else (including '' and arrays) is a coercion failure.
      if (typeof raw === 'string' && raw.trim() !== '' && !Number.isNaN(Number(raw))) {
        return Number(raw);
      }
      throw new Error(String(raw));
    },
    check: (value) => typeof value === 'number' && !Number.isNaN(value),
    promptType: 'numeral',
  },
  boolean: {
    coerce: (raw) => {
      if (typeof raw === 'boolean') return raw;
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      // a bare flag ('--dry') arrives as `true` from yargs; handled above.
      throw new Error(String(raw));
    },
    check: (value) => typeof value === 'boolean',
    promptType: 'confirm',
  },
};

/**
 * @description Resolves a descriptor's `type` to a value: a registry name to its
 * entry, a function to itself (the customization path), an unrecognized string
 * to a load-time error naming the parameter. */
export const resolveType = (descriptor: ParamDescriptor): ((raw: unknown) => unknown) => {
  const { name, type } = descriptor;
  if (typeof type === 'function') return type;
  const def = BUILTIN_TYPES[type];
  if (!def) throw new ParamUnknownTypeError(name, String(type));
  return def.coerce;
};

/** @description The prompt input kind for a descriptor's declared type. */
export const promptTypeOf = (descriptor: ParamDescriptor): string => {
  const { type } = descriptor;
  if (typeof type === 'function') return 'input';
  return BUILTIN_TYPES[type]?.promptType ?? 'input';
};

/**
 * @description Coerces one raw value for a descriptor. Native values of the
 * declared type pass through unchanged (yargs may already have parsed them);
 * a function type's result is returned as-is; a coercion failure names the
 * parameter and the expected type. */
export const coerceParam = (descriptor: ParamDescriptor, raw: unknown): unknown => {
  try {
    return resolveType(descriptor)(raw);
  } catch (cause) {
    const typeName = typeof descriptor.type === 'function' ? 'function' : descriptor.type;
    throw new ParamCoercionError(descriptor.name, typeName, raw);
  }
};

/**
 * @description Validates one (possibly prompt-answered) parameter value against
 * its descriptor. */
export const checkParam = (descriptor: ParamDescriptor, value: unknown): boolean => {
  const { type } = descriptor;
  if (typeof type === 'function') return true;
  return BUILTIN_TYPES[type]?.check(value) ?? true;
};

/**
 * @description Validates the full schema against the merged flag/answer values:
 * builtin-typed values are checked, and required-but-absent parameters fail.
 * Returns the validated values map. */
export const validateParams = (
  schema: ParamDescriptor[],
  values: Record<string, unknown>,
): Record<string, unknown> => {
  for (const descriptor of schema) {
    const value = values[descriptor.name];
    if (value === undefined) {
      if (descriptor.required) throw new ParamRequiredError(descriptor.name);
      continue;
    }
    if (!checkParam(descriptor, value)) {
      const typeName =
        typeof descriptor.type === 'function' ? 'function' : descriptor.type;
      throw new ParamCoercionError(descriptor.name, typeName, value);
    }
  }
  return values;
};
