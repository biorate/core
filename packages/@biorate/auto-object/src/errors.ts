import { BaseError } from '@biorate/errors';

export class CommonFactoryValidationError extends BaseError {
  public constructor(classname: string, meta: string[]) {
    super('Validation error [%s], %s', [classname, meta], { status: 400, meta });
  }
}

export class CommonFactoryTypeError extends BaseError {
  public constructor(classname: string, message: string, meta?: any) {
    super('Type error [%s], %s', [classname, message], { status: 400, meta });
  }
}
