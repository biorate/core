import { omit, pick } from 'lodash';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
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
   * @description Cache WeakMap
   */
  protected static cache = new WeakMap<
    Function,
    { instance: Axios; client: AxiosInstance }
  >();
  /**
   * @description Fetch request
   */
  public static async fetch<T = any, D = any>(
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T, D>> {
    let data = this.cache.get(this);
    if (!data) {
      const instance = new this();
      const client = axios.create({
        ...omit(instance, axiosRetryConfigKeys),
      });
      retry(client, pick(instance, axiosRetryConfigKeys) as IAxiosRetryConfig);
      data = { instance, client };
      this.cache.set(this, data);
    }
    try {
      return await data.client(options);
    } catch (e) {
      await data.instance.catch(e);
    } finally {
      await data.instance.finally();
    }
  }
  /**
   * @description Catch hook
   */
  protected async catch(e: Error) {
    throw e;
  }
  /**
   * @description Finally hook
   */
  protected async finally() {}
}
