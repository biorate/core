import { BaseError } from '@biorate/errors';

/** @description Error thrown when connection to Vault fails */
export class VaultCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Vault: [%s]`, [e.message]);
  }
}
