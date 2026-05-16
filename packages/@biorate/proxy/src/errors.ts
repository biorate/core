import { BaseError } from '@biorate/errors';

/** @description Can't connect to proxy error. */
export class ProxyCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Proxy: [%s]`, [e.message]);
  }
}

/** @description Proxy connection timeout error. */
export class ProxyConnectionTimeoutError extends BaseError {
  public constructor(name: string) {
    super(`Proxy connection timeout: [%s]`, [name]);
  }
}
