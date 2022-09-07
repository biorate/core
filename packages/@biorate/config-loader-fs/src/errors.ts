import { BaseError } from '@biorate/errors';

export class ConfigLoaderFsNotFoundPathError extends BaseError {
  public constructor(name: string, reason: string) {
    super("%s.json didn't find, [%s]", [name, reason]);
  }
}
