import { BaseError } from '@biorate/errors';

export class CommonFactoryValidationError extends BaseError {
  public constructor(classname: string, meta: string[]) {
    super('Validation error [%s], %s', [classname, meta], { status: 400, meta });
  }
}
