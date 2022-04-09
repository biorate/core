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
  /**
   * @description Axios instance cache
   */
  protected static cache = new WeakMap<Object, Axios>();
  /**
   * @description Fetch static method
   */
  public static fetch(...args) {
    return this._fetch(...args);
  }
  /**
   * @description Protected fetch static method
   */
  protected static _fetch<D = any>(
    data?: Record<string, unknown>,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse<D>> {
    if (!this.cache.has(this)) this.cache.set(this, new this());
    return this.cache.get(this).fetch<D>(data, options);
  }
  /**
   * @description Axios client cache
   */
  #client: AxiosInstance;
  /**
   * @description Fetch method
   */
  protected async fetch<D>(
    data?: Record<string, unknown>,
    options?: AxiosRequestConfig & { path?: Record<string, string | number> },
  ): Promise<AxiosResponse<D>> {
    if (!this.#client) {
      this.#client = axios.create();
      retry(this.#client, <IAxiosRetryConfig>pick(this, axiosRetryConfigKeys));
    }
    const settings = { ...this, ...options };
    if (settings.baseURL && settings.path)
      settings.baseURL = pathToUrl(settings.baseURL, settings.path);
    if (settings.url && settings.path)
      settings.url = pathToUrl(settings.url, settings.path);
    const params = {
      ...omit(settings, axiosRetryConfigKeys.concat(axiosExcludeKeys)),
      ...data,
    };
    try {
      return await this.#client(params);
    } catch (e) {
      await this.catch(e);
    } finally {
      await this.finally();
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
