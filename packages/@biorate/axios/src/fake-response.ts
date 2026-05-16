import {
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

/** @description Fake AxiosResponse implementation used for stubbing HTTP calls. */
export class FakeResponse<T = any, D = any, H = Record<string, unknown>>
  implements AxiosResponse<T, D, H>
{
  /** @description Creates a fake Axios response with the given data, status, headers and config. */
  public constructor(
    public data: T,
    public status: number,
    public statusText: string,
    public headers: (H & RawAxiosResponseHeaders) | AxiosResponseHeaders,
    public config: InternalAxiosRequestConfig<D>,
    public request?: any,
  ) {}
}
