import { BaseError } from '@biorate/errors';

/**
 * @description Thrown when an unsupported protocol is encountered in the exception filter.
 */
export class UnsupportedProtocolError extends BaseError {
  public constructor(name: string) {
    super(`Unsupported protocol: [%s]`, [name]);
  }
}

/**
 * @description Thrown on Axios HTTP request errors.
 */
export class AxiosRequestError extends BaseError {
  public constructor(code: number, error: string, message: string) {
    super(`Axios request error (%s) [%s]: %s`, [code, error, message]);
  }
}

/**
 * @description Thrown when an origin fails CORS validation.
 */
export class CorsBadOriginError extends BaseError {
  public constructor(origin: string) {
    super(`Cors bad origin error: [%s]`, [origin]);
  }
}
