import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the admin client cannot establish a connection.
 */
export class RDKafkaAdminCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Admin: [%s]`, [e.message]);
  }
}
