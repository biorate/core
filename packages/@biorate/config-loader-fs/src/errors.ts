import { BaseError } from '@biorate/errors';

export class ConfigLoaderFsFileNotLoadedError extends BaseError {
  public constructor(name: string, reason: string) {
    super("ConfigLoaderFs: file [%s] - didn't merge, reason: [%s]", [name, reason]);
  }
}
