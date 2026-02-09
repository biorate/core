import {
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
  InternalAxiosRequestConfig,
} from 'axios';

export class FakeResponse<T = any, D = any, H = Record<string, unknown>>
  implements AxiosResponse<T, D, H>
{
  public constructor(
    public data: T,
    public status: number,
    public statusText: string,
    public headers: (H & RawAxiosResponseHeaders) | AxiosResponseHeaders,
    public config: InternalAxiosRequestConfig<D>,
    public request?: any,
  ) {}
}
