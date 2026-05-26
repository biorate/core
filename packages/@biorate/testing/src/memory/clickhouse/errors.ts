import { BaseError } from '@biorate/errors';

/** @description Thrown when a ClickHouse query is not supported by the in-memory client. */
export class ClickhouseUnsupportedInMemoryError extends BaseError {
  public constructor(query: string) {
    super('ClickHouse query [%s] is not supported in memory profile', [query]);
  }
}
