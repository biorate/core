import { BaseError } from '@biorate/errors';

export class UnsupportedProtocolError extends BaseError {
  public constructor(name: string) {
    super(`Unsupported protocol: [%s]`, [name]);
  }
}
