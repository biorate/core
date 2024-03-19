import { BaseError } from '@biorate/errors';

export class HaproxyCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Haproxy: [%s]`, [e.message]);
  }
}

export class HaproxyConnectionTimeoutError extends BaseError {
  public constructor(name: string) {
    super(`Haproxy connection timeout: [%s]`, [name]);
  }
}
