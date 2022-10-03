import { omit, pick, merge } from 'lodash';
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import retry, { IAxiosRetryConfig } from 'axios-retry';
// @ts-ignore
import * as pathToUrl from 'path-to-url';
import { IAxiosFetchOptions } from './interfaces';

export * from 'axios';
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
  protected static cache = new WeakMap<typeof Axios, Axios>();
  /**
   * @description Fetch static method
   */
  public static fetch(options?: any) {
    return this._fetch(options);
  }
  /**
   * @description Protected fetch static method
   */
  protected static _fetch<T = any, D = any>(
    options?: IAxiosFetchOptions,
  ): Promise<AxiosResponse<T, D>> {
    if (!this.cache.has(this)) this.cache.set(this, new this());
    // @ts-ignore
    return this.cache.get(this).fetch<T, D>(options);
  }
  /**
   * @description Axios client cache
   */
  #client: AxiosInstance | undefined;
  /**
   * @description Fetch method
   */
  protected async fetch<T, D>(
    options?: IAxiosFetchOptions,
  ): Promise<AxiosResponse<T, D>> {
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
    await this.before(params);
    const startTime = this.getStartTime();
    try {
      const result = await this.#client(params);
      await this.after<T>(result, startTime);
      return result;
    } catch (e: unknown) {
      await this.catch(<Error>e, startTime);
      throw e;
    } finally {
      await this.finally(startTime);
    }
  }
  /**
   * @description Get start time method
   */
  protected getStartTime(): [number, number] {
    return [Date.now(), 0];
  }
  /**
   * @description Before hook
   */
  protected async before(params: IAxiosFetchOptions) {}
  /**
   * @description After hook
   */
  protected async after<T = any, D = any>(
    result: AxiosResponse<T, D>,
    startTime: [number, number],
  ) {}
  /**
   * @description Catch hook
   */
  protected async catch(e: Error, startTime: [number, number]) {}
  /**
   * @description Finally hook
   */
  protected async finally(startTime: [number, number]) {}
}
