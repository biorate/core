import { BaseError } from '@biorate/errors';

/** @description Thrown when an operation is not supported by the in-memory Redis client. */
export class RedisUnsupportedInMemoryError extends BaseError {
  public constructor(command: string) {
    super(`Unsupported in-memory Redis command: [%s]`, [command]);
  }
}
