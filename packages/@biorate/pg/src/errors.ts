import { BaseError } from '@biorate/errors';

export class PgCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Pg: [%s]`, [e.message]);
  }
}
