import { omit, pick, merge } from 'lodash';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import retry, { IAxiosRetryConfig } from 'axios-retry';
// @ts-ignore
import * as pathToUrl from 'path-to-url';
import { IAxiosFetchOptions } from './interfaces';

export * from './interfaces';

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
  public static fetch(options?: any) {
    return this._fetch(options);
  }
  /**
   * @description Protected fetch static method
   */
  protected static _fetch<D = any>(
    options?: IAxiosFetchOptions,
  ): Promise<AxiosResponse<D>> {
    if (!this.cache.has(this)) this.cache.set(this, new this());
    // @ts-ignore
    return this.cache.get(this).fetch<D>(options);
  }
  /**
   * @description Axios client cache
   */
  #client: AxiosInstance | undefined;
  /**
   * @description Fetch method
   */
  protected async fetch<D>(options?: IAxiosFetchOptions): Promise<AxiosResponse<D>> {
    if (!this.#client) {
      this.#client = axios.create();
      retry(this.#client, <IAxiosRetryConfig>pick(this, axiosRetryConfigKeys));
    }
    const settings = merge({ ...this }, options);
    if (settings.baseURL && settings.path)
      settings.baseURL = pathToUrl(settings.baseURL, settings.path);
    if (settings.url && settings.path)
      settings.url = pathToUrl(settings.url, settings.path);
    const params = {
      ...omit(settings, axiosRetryConfigKeys.concat(axiosExcludeKeys)),
    };
    try {
      await this.before(params);
      return await this.#client(params);
    } catch (e: unknown) {
      await this.catch(<Error>e);
      throw e;
    } finally {
      await this.finally();
    }
  }
  /**
   * @description Before hook
   */
  protected async before(params: IAxiosFetchOptions) {}

  /**
   * @description Catch hook
   */
  protected async catch(e: Error) {}
  /**
   * @description Finally hook
   */
  protected async finally() {}
}
