import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the consumer cannot establish a connection.
 */
export class RDKafkaConsumerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Consumer: [%s]`, [e.message]);
  }
}
