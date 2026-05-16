import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to Minio. */
export class MinioCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Minio: [%s]`, [e.message]);
  }
}
