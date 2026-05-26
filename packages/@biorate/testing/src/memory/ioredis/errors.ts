import { BaseError } from '@biorate/errors';

/** @description Thrown when an IORedis command is not supported by the in-memory client. */
export class IORedisUnsupportedInMemoryError extends BaseError {
  public constructor(command: string) {
    super('IORedis command [%s] is not supported in memory profile', [command]);
  }
}
