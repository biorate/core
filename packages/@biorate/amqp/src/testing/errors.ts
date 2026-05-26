import { BaseError } from '@biorate/errors';

/** @description Thrown when an operation is not supported by the in-memory AMQP connector. */
export class AmqpUnsupportedInMemoryError extends BaseError {
  public constructor(operation: string) {
    super(`Unsupported in-memory AMQP operation: [%s]`, [operation]);
  }
}
