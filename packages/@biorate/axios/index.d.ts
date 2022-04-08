import { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module '@biorate/axios' {
  export class Axios {
    public static fetch<T = any, D = any>(
      options?: AxiosRequestConfig,
    ): AxiosResponse<T, D>;
    protected catch(e: Error): Promise<void>;
    protected finally(): Promise<void>;
  }
}
