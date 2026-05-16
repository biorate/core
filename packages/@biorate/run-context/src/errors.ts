import { BaseError } from '@biorate/errors';

/** @description Thrown when a context key is registered more than once. */
export class RunContextKeyAlreadyExistsError extends BaseError {
  public constructor() {
    super(`Key already exists`);
  }
}
