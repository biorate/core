import { Axios } from '@biorate/axios';

export class Ping extends Axios {
  public static fetch(baseURL: string) {
    return this._fetch<unknown>({ baseURL });
  }
}
