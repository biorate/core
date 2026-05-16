import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when the KafkaJS admin client cannot connect.
 */
export class KafkaJSAdminCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSAdmin: [%s]`, [e.message]);
  }
}
