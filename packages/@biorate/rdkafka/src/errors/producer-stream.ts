import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the producer stream cannot establish a connection.
 */
export class RDKafkaProducerStreamCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to ProducerStream: [%s]`, [e.message]);
  }
}
