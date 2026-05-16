import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to OpenSearch. */
export class OpenSearchCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Elastic: [%s]`, [e.message]);
  }
}
