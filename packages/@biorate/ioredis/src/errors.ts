import { BaseError } from '@biorate/errors';

export class IORedisCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to IORedis: [%s]`, [e.message]);
  }
}
