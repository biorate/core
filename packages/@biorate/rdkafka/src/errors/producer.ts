import { BaseError } from '@biorate/errors';

export class RDKafkaProducerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Producer: [%s]`, [e.message]);
  }
}
