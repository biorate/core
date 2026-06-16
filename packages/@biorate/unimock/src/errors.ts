import { BaseError } from '@biorate/errors';

export class UnimockReplayMissError extends BaseError {
  public constructor(key: string) {
    super(`Unimock replay miss: [%s]`, [key]);
  }
}

export class UnimockSerializeError extends BaseError {
  public constructor(serializerName: string, cause: Error) {
    super(`Unimock serialize error in [%s]: %s`, [serializerName, cause.message]);
    this.cause = cause;
  }
}

