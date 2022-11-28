import { BaseError } from '@biorate/errors';

export class KafkaJSProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSProducer: [%s]`, [e.message]);
  }
}
