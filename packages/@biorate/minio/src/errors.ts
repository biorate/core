import { BaseError } from '@biorate/errors';

export class MinioCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Minio: [%s]`, [e.message]);
  }
}
