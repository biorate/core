import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the consumer stream cannot establish a connection.
 */
export class RDKafkaConsumerStreamCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to ConsumerStream: [%s]`, [e.message]);
  }
}

/**
 * @description Thrown when attempting to subscribe to a consumer stream that is already subscribed.
 */
export class RDKafkaConsumerStreamAlreadySubscribedError extends BaseError {
  public constructor() {
    super(`Consumer stream already subscribed`);
  }
}
