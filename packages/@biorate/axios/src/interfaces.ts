import { AxiosRequestConfig } from 'axios';

export type IAxiosFetchOptions = AxiosRequestConfig & {
  path?: Record<string, string | number>;
  retry?: boolean;
};

export type IStubParam = {
  data: Record<string, any> | string;
  status?: number;
  statusText?: string;
  headers?: Record<string, any>;
  config?: Record<string, any>;
};
