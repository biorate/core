import { BaseError } from '@biorate/errors';

/** @description Thrown when an operation is not supported by the in-memory PostgreSQL client. */
export class PgUnsupportedInMemoryError extends BaseError {
  public constructor(operation: string) {
    super(`Unsupported in-memory PostgreSQL operation: [%s]`, [operation]);
  }
}
