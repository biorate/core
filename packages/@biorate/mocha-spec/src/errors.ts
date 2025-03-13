import { BaseError } from '@biorate/errors';

export class ValidationError extends BaseError {
  public constructor(type: string, schema: any, errors: string[]) {
    super(`In [%s] %s: [%s]`, [schema?.name, type, errors.join(', ')], {
      errors: errors,
    });
  }
}

export class ValidationSchemaWrongTypeError extends BaseError {
  public constructor(type: string) {
    super(`validation schema wrong type: [%s]`, [type]);
  }
}

export class MochaChaiJestSnapshotError extends BaseError {
  public constructor() {
    super(`[chai] module with [mocha-chai-jest-snapshot] plugin required!`, [], {});
  }
}
