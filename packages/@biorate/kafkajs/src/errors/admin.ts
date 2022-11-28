import { BaseError } from '@biorate/errors';

export class KafkaJSAdminCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to KafkaJSAdmin: [%s]`, [e.message]);
  }
}
