import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the high-level producer cannot establish a connection.
 */
export class RDKafkaHighLevelProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to HighLevelProducer: [%s]`, [e.message]);
  }
}
