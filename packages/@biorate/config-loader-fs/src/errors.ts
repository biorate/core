import { BaseError } from '@biorate/errors';

export class ConfigLoaderFsFileNotLoadedError extends BaseError {
  public constructor(name: string, reason: string) {
    super("ConfigLoaderFs: file [%s] - didn't merged, reason: [%s]", [name, reason]);
  }
}
