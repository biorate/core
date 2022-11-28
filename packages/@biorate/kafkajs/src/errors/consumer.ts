import { BaseError } from '@biorate/errors';

export class KafkaJSConsumerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSConsumer: [%s]`, [e.message]);
  }
}
