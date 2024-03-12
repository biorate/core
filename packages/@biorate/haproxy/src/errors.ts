import { BaseError } from '@biorate/errors';

export class HaproxyCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Haproxy: [%s]`, [e.message]);
  }
}
