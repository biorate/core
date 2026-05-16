import { Axios } from '@biorate/axios';

/** @description Performs HTTP liveness checks against upstream clients via Axios. */
export class Ping extends Axios {
  public static fetch(baseURL: string) {
    return this._fetch<unknown>({ baseURL });
  }
}
