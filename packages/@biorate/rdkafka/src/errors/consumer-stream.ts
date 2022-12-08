import { BaseError } from '@biorate/errors';

export class RDKafkaConsumerStreamCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to ConsumerStream: [%s]`, [e.message]);
  }
}

export class RDKafkaConsumerStreamAlreadySubscribedError extends BaseError {
  public constructor() {
    super(`Consumer stream already subscribed`);
  }
}
