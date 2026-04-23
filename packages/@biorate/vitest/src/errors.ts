import { BaseError } from '@biorate/errors';

export class ValidationSchemaWrongTypeError extends BaseError {
  public constructor(type: string) {
    super(`Schema must be a class or function, got: %s`, [type]);
  }
}

export class ValidationError extends BaseError {
  public constructor(type: 'schema' | 'function', schema: any, errors: string[]) {
    super(`Validation failed for ${type} [${schema?.name || schema}]: %s`, [
      errors.join(', '),
    ]);
  }
}
