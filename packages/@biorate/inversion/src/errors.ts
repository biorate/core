import { BaseError } from '@biorate/errors';

export class InversionInjectionIsUndefinedError extends BaseError {
  public constructor() {
    super(`Injection is undefined`);
  }
}
