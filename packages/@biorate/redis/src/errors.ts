import { BaseError } from '@biorate/errors';

export class RedisCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Redis: [%s]`, [e.message]);
  }
}
