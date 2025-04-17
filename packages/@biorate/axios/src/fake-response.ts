import { AxiosResponse, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';

export class FakeResponse<T = any, D = any> implements AxiosResponse {
  public constructor(
    public data: T,
    public status: number,
    public statusText: string,
    public headers: AxiosResponseHeaders,
    public config: AxiosRequestConfig<D>,
    public request?: any,
  ) {}
}
