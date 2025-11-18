import { BaseError } from '@biorate/errors';

export class UnsupportedProtocolError extends BaseError {
  public constructor(name: string) {
    super(`Unsupported protocol: [%s]`, [name]);
  }
}

export class AxiosRequestError extends BaseError {
  public constructor(code: number, error: string, message: string) {
    super(`Axios request error (%s) [%s]: %s`, [code, error, message]);
  }
}

export class CorsBadOriginError extends BaseError {
  public constructor(origin: string) {
    super(`Cors bad origin error: [%s]`, [origin]);
  }
}
