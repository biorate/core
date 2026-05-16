import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to IORedis. */
export class IORedisCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to IORedis: [%s]`, [e.message]);
  }
}
