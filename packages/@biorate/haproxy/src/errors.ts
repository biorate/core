import { BaseError } from '@biorate/errors';

/** @description Error thrown when unable to connect to HAProxy. */
export class HaproxyCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Haproxy: [%s]`, [e.message]);
  }
}

/** @description Error thrown when a connection to HAProxy times out. */
export class HaproxyConnectionTimeoutError extends BaseError {
  public constructor(name: string) {
    super(`Haproxy connection timeout: [%s]`, [name]);
  }
}
