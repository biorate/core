import { BaseError } from '@biorate/errors';

export class RunContextKeyAlreadyExistsError extends BaseError {
  public constructor() {
    super(`Key already exists`);
  }
}
