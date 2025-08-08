import { omit, pick, merge } from 'lodash';
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import retry from 'axios-retry';
import { IAxiosRetryConfig } from 'axios-retry/dist/esm';
// @ts-ignore
import * as pathToUrl from 'path-to-url';
import { Singleton } from '@biorate/singleton';
import { Stubs } from './stubs';
import { IAxiosFetchOptions, IStubParam } from './interfaces';

export * from 'axios';
export * from './interfaces';

const axiosRetryConfigKeys = [
  'retries',
  'retryDelay',
  'shouldResetTimeout',
  'retryCondition',
  'onRetry',
];

const axiosExcludeKeys = ['path', 'config', 'retry'];

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
export class Axios extends Singleton {
  /**
   * @description Axios instance cache
   */
  protected static mocks = new WeakMap<typeof Axios, { value: boolean }>();
  /**
   * @description Stubs instance cache
   */
  protected static get stubs() {
    return Stubs.get(this);
  }
  /**
   * @description Stubs options cache
   */
  public static get options() {
    return Stubs.get(this).options;
  }
  /**
   * @description Fetch static method
   */
  public static fetch(options?: any) {
    return this._fetch(options);
  }
  /**
   * @description Stub static method
   */
  public static stub(params: IStubParam, persist = false) {
    this.stubs.stub(this.instance<Axios>(), params, persist);
  }
  /**
   * @description Unstub static method
   */
  public static unstub() {
    this.stubs.unstub();
  }
  /**
   * @description Use mock static method
   */
  public static useMock() {
    this.mocks.set(this, { value: true });
  }
  /**
   * @description Set defaults
   */
  public static get defaults() {
    return axios.defaults;
  }
  /**
   * @description Get mock static method
   */
  protected static getMock<T = any, D = any>(
    instance: Axios,
    options?: IAxiosFetchOptions,
  ): undefined | AxiosResponse<T, D> {
    return undefined;
  }
  /**
   * @description Set mock static method
   */
  protected static setMock<T = any, D = any>(
    instance: Axios,
    result: AxiosResponse<T, D>,
    options?: IAxiosFetchOptions,
  ) {}
  /**
   * @description Protected fetch static method
   */
  protected static async _fetch<T = any, D = any>(
    options?: IAxiosFetchOptions,
  ): Promise<AxiosResponse<T, D>> {
    const instance = this.instance<Axios>();
    const useMock = this.mocks.get(this)?.value;
    if (useMock) {
      const mock = this.getMock<T, D>(instance, options);
      if (mock) return mock;
    }
    const result = await instance.fetch<T, D>(options);
    if (useMock) this.setMock<T, D>(instance, result, options);
    return result;
  }
  /**
   * @description Axios client cache
   */
  #client: AxiosInstance;
  /**
   * @description Default timeout limit
   */
  public timeout = 15000;
  /**
   * @description Fetch method
   */
  protected async fetch<T, D>(
    options?: IAxiosFetchOptions,
  ): Promise<AxiosResponse<T, D>> {
    const settings = merge({ ...this }, options);
    if (!this.#client) {
      this.#client = axios.create();
      if (settings.retry)
        // @ts-ignore: TODO: Stranger Things
        retry(this.#client, <IAxiosRetryConfig>pick(this, axiosRetryConfigKeys));
    }
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
      await this.after<T>(result, startTime, params);
      return result;
    } catch (e: unknown) {
      await this.catch(<Error>e, startTime, params);
      throw e;
    } finally {
      await this.finally(startTime, params);
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
  protected async before(params?: IAxiosFetchOptions) {}
  /**
   * @description After hook
   */
  protected async after<T = any, D = any>(
    result: AxiosResponse<T, D>,
    startTime: [number, number],
    params?: IAxiosFetchOptions,
  ) {}
  /**
   * @description Catch hook
   */
  protected async catch(
    e: Error,
    startTime: [number, number],
    params?: IAxiosFetchOptions,
  ) {}
  /**
   * @description Finally hook
   */
  protected async finally(startTime: [number, number], params?: IAxiosFetchOptions) {}
}
