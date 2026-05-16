import { BaseError } from '@biorate/errors';

/** @description Thrown when validation of an object fails against its class-validator constraints. */
export class CommonFactoryValidationError extends BaseError {
  public constructor(classname: string, meta: string[]) {
    super('Validation error [%s], %s', [classname, meta], { status: 400, meta });
  }
}

/** @description Thrown when a type mismatch or type-related error occurs during factory instantiation. */
export class CommonFactoryTypeError extends BaseError {
  public constructor(classname: string, message: string, meta?: any) {
    super('Type error [%s], %s', [classname, message], { status: 400, meta });
  }
}
