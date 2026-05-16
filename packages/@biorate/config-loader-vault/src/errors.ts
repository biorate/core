import { BaseError } from '@biorate/errors';

/** @description ConfigLoaderVault unknown cache error. */
export class ConfigLoaderVaultUnknownCacheError extends BaseError {
  public constructor(e: Error) {
    super(`Unknown cache error: [%s]`, [e.message]);
  }
}
