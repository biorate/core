import { BaseError } from '@biorate/errors';

/**
 * @description Error thrown when CLI arguments list is empty — no paths provided to clean.
 */
export class ArgvEmptyListError extends BaseError {
  public constructor() {
    super(`Argv is empty`);
  }
}
