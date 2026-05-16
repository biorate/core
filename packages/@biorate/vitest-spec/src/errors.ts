import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when validation fails (schema-based or function-based).
 *
 * @example
 * ```ts
 * throw new ValidationError('schema', MySchema, ['property x is required']);
 * ```
 */
export class ValidationError extends BaseError {
  public constructor(type: string, schema: any, errors: string[]) {
    super(`In [%s] %s: [%s]`, [schema?.name, type, errors.join(', ')], {
      errors: errors,
    });
  }
}

/**
 * @description Thrown when the schema argument is neither a class nor a function.
 */
export class ValidationSchemaWrongTypeError extends BaseError {
  public constructor(type: string) {
    super(`validation schema wrong type: [%s]`, [type]);
  }
}

/**
 * @description Thrown when Vitest's `toMatchSnapshot()` matcher is not available.
 */
export class VitestSnapshotError extends BaseError {
  public constructor() {
    super(`[vitest] expect().toMatchSnapshot() required!`, [], {});
  }
}
