import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the KafkaJS consumer cannot connect.
 */
export class KafkaJSConsumerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSConsumer: [%s]`, [e.message]);
  }
}
