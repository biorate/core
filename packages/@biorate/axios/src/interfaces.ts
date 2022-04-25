import { AxiosRequestConfig } from 'axios';

export type IAxiosFetchOptions = AxiosRequestConfig & {
  path?: Record<string, string | number>;
};
