import { Axios, IAxiosFetchOptions } from '@biorate/axios';

/** @description Performs HTTP liveness checks against upstream clients via Axios. */
export class Ping extends Axios {
  public static fetch(baseURL: string, options?: IAxiosFetchOptions) {
    return this._fetch<unknown>({ ...options, baseURL });
  }
}
