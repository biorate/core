import { BaseError } from '@biorate/errors';

export class RDKafkaAdminCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Admin: [%s]`, [e.message]);
  }
}
