import { BaseError } from '@biorate/errors';

/** @description Config file not found path error. */
export class ConfigFileNotFoundPathError extends BaseError {
  public constructor(name: string, reason: string) {
    super("%s.json didn't find, [%s]", [name, reason]);
  }
}
