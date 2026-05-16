import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the KafkaJS producer cannot connect.
 */
export class KafkaJSProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSProducer: [%s]`, [e.message]);
  }
}
