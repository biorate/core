import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to PostgreSQL. */
export class PgCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Pg: [%s]`, [e.message]);
  }
}
