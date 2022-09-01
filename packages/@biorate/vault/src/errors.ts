import { BaseError } from '@biorate/errors';

export class VaultCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Vault: [%s]`, [e.message]);
  }
}
