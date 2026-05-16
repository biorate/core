import { BaseError } from '@biorate/errors';

/** @description Thrown when a requested injection is undefined. */
export class InversionInjectionIsUndefinedError extends BaseError {
  public constructor() {
    super(`Injection is undefined`);
  }
}
