import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to MSSQL. */
export class MssqlCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Mssql: [%s]`, [e.message]);
  }
}
