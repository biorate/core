import { BaseError } from '@biorate/errors';

/** @description Thrown when a Vault operation is not supported by the in-memory client. */
export class VaultUnsupportedInMemoryError extends BaseError {
  public constructor(operation: string) {
    super('Vault operation [%s] is not supported in memory profile', [operation]);
  }
}
