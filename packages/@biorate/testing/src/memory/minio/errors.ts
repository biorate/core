import { BaseError } from '@biorate/errors';

/** @description Thrown when a MinIO operation is not supported by the in-memory client. */
export class MinioUnsupportedInMemoryError extends BaseError {
  public constructor(operation: string) {
    super('MinIO operation [%s] is not supported in memory profile', [operation]);
  }
}
