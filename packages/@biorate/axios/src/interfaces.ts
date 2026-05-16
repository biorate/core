import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/** @description Axios request configuration extended with path params and retry flag. */
export type IAxiosFetchOptions = AxiosRequestConfig & {
  path?: Record<string, string | number>;
  retry?: boolean;
};

/** @description Parameters for a stub response: data, status, headers and config. */
export type IStubParam = {
  data: Record<string, any> | string;
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  config?: InternalAxiosRequestConfig<any>;
};
