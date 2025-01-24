import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAxiosFetchOptions } from './src';

declare module '@biorate/axios' {
  export class Axios {
    public static fetch<T = any, D = any>(
      options?: AxiosRequestConfig,
    ): AxiosResponse<T, D>;

    protected before(params?: IAxiosFetchOptions): Promise<void>;

    protected after<T = any, D = any>(
      result: AxiosResponse<T, D>,
      startTime: [number, number],
      params?: IAxiosFetchOptions,
    ): Promise<void>;

    protected catch(
      e: Error,
      startTime: [number, number],
      params?: IAxiosFetchOptions,
    ): Promise<void>;

    protected finally(
      startTime: [number, number],
      params?: IAxiosFetchOptions,
    ): Promise<void>;
  }
}
