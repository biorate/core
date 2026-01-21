import { BaseError } from '@biorate/errors';

export class ArgvEmptyListError extends BaseError {
  public constructor() {
    super(`Argv is empty`);
  }
}
