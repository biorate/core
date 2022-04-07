import { omit, pick } from 'lodash';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import retry, { IAxiosRetryConfig } from 'axios-retry';
import { create } from '@biorate/symbolic';

const Symbols = create('axios');

const axiosRetryConfigKeys = [
  'retries',
  'retryDelay',
  'shouldResetTimeout',
  'retryCondition',
];

/**
 * @description
 * Axios OOP static interface
 *
 * ### Features:
 * - OOP
 * - DI
 *
 * @example
 * ```
 * import { Axios } from '@biorate/axios';
 *
 * class Yandex extends Axios {
 *   public baseURL = 'https://yandex.ru';
 * }
 *
 * (async () => {
 *   const response = await Yandex.fetch<string>();
 *   console.log(response.status); // 200
 *   console.log(response.data); // <!DOCTYPE html><html ...
 * })();
 * ```
 */
export class Axios {
  /**
   * @description Fetch request
   */
  public static fetch<T = any, D = any>(
    options?: AxiosRequestConfig,
  ): AxiosResponse<T, D> {
    if (!this[Symbols.Client]) {
      this[Symbols.Client] = axios.create({
        ...omit(new this(), axiosRetryConfigKeys),
      });
      retry(
        this[Symbols.Client],
        pick(new this(), axiosRetryConfigKeys) as IAxiosRetryConfig,
      );
    }
    return this[Symbols.Client]<T, D>(options);
  }
}
