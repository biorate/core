import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the producer cannot establish a connection.
 */
export class RDKafkaProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Producer: [%s]`, [e.message]);
  }
}
