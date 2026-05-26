import { BaseError } from '@biorate/errors';

/** @description Thrown when an OpenSearch operation is not supported by the in-memory client. */
export class OpenSearchUnsupportedInMemoryError extends BaseError {
  public constructor(operation: string) {
    super('OpenSearch operation [%s] is not supported in memory profile', [operation]);
  }
}
