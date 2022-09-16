import { BaseError } from '@biorate/errors';

export class RDKafkaHighLevelProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to HighLevelProducer: [%s]`, [e.message]);
  }
}
