import { omit, pick } from 'lodash';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import retry, { IAxiosRetryConfig } from 'axios-retry';
import * as pathToUrl from 'path-to-url';

const axiosRetryConfigKeys = [
  'retries',
  'retryDelay',
  'shouldResetTimeout',
  'retryCondition',
];

const axiosExcludeKeys = ['path', 'config'];

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
  protected static cache = new WeakMap<
    Object,
    { instance: Axios; client: AxiosInstance }
  >();
  /**
   * @description Fetch request
   */
  public static async fetch<T = any, D = any>(
    options?: AxiosRequestConfig & { path?: Record<string, string | number> },
  ): Promise<AxiosResponse<T, D>> {
    let data = Axios.cache.get(this);
    if (!data) {
      const instance = new this();
      const client = axios.create();
      retry(client, pick(instance, axiosRetryConfigKeys) as IAxiosRetryConfig);
      data = { instance, client };
      Axios.cache.set(this, data);
    }
    const { instance, client } = data;
    const settings = { ...instance, ...options };
    if (settings.baseURL && settings.path)
      settings.baseURL = pathToUrl(settings.baseURL, settings.path);
    if (settings.url && settings.path)
      settings.url = pathToUrl(settings.url, settings.path);
    const params = { ...omit(settings, axiosRetryConfigKeys.concat(axiosExcludeKeys)) };
    try {
      return await client(params);
    } catch (e) {
      await instance.catch(e);
    } finally {
      await instance.finally();
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
