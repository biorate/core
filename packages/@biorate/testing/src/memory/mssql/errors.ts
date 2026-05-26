import { BaseError } from '@biorate/errors';

/** @description Thrown when an MSSQL query is not supported by the in-memory client. */
export class MssqlUnsupportedInMemoryError extends BaseError {
  public constructor(query: string) {
    super('MSSQL query [%s] is not supported in memory profile', [query]);
  }
}
