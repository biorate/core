import { BaseError } from '@biorate/errors';

export class ConfigLoaderVaultUnknownCacheError extends BaseError {
  public constructor(e: Error) {
    super(`Unknown cache error: [%s]`, [e.message]);
  }
}
