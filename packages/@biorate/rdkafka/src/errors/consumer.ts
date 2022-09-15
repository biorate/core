import { BaseError } from '@biorate/errors';

export class RDKafkaConsumerCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Consumer: [%s]`, [e.message]);
  }
}
