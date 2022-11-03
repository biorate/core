import { BaseError } from '@biorate/errors';

export class MssqlCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Mssql: [%s]`, [e.message]);
  }
}
