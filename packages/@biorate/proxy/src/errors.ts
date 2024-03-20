import { BaseError } from '@biorate/errors';

export class ProxyCantConnectError extends BaseError {
  public constructor(e: Error) {
    super(`Can't connect to Proxy: [%s]`, [e.message]);
  }
}

export class ProxyConnectionTimeoutError extends BaseError {
  public constructor(name: string) {
    super(`Proxy connection timeout: [%s]`, [name]);
  }
}
