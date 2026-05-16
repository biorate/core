import { BaseError } from '@biorate/errors';

/** @description Error thrown when connection to Redis fails */
export class RedisCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Redis: [%s]`, [e.message]);
  }
}
