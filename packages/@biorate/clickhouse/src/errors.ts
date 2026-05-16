import { BaseError } from '@biorate/errors';

/** @description Clickhouse connection error. */
export class ClickhouseCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Clickhouse: [%s]`, [e.message]);
  }
}
