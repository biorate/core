import { BaseError } from '@biorate/errors';

export class RDKafkaProducerStreamCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to ProducerStream: [%s]`, [e.message]);
  }
}
