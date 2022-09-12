import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { AxiosError, AxiosResponse } from 'axios';
import { Axios } from '@biorate/axios';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';

/**
 * @description
 * Axios-prometheus HTTP interface
 *
 * ### Features:
 * - Metrics of you HTTP requests out of the box
 *
 * @example
 * ```
 * import { container, Types } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { AxiosPrometheus } from '@biorate/axios-prometheus';
 *
 * export class Google extends AxiosPrometheus {
 *   public baseURL = this.config.get<string>('baseURL');
 *   public url = '/';
 *   public method = 'get';
 *   public timeout = 1500;
 * }
 *
 * container.bind(Types.Config).to(Config).inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   baseURL: 'https://google.com',
 * });
 *
 * (async () => {
 *   await Google.fetch();
 * })();
 * ```
 */
export abstract class AxiosPrometheus extends Axios {
  protected get config() {
    return container.get<IConfig>(Types.Config);
  }

  @counter({
    name: 'api_request_counter',
    help: 'api request counter',
    labelNames: ['method', 'baseUrl', 'statusCode'],
  })
  protected counter: Counter;

  @histogram({
    name: 'api_response_time',
    help: 'api response time',
    labelNames: ['method', 'baseUrl', 'statusCode'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  protected histogram: Histogram;

  public abstract baseURL: string;
  public abstract url: string;
  public abstract method: string;

  protected log(statusCode: number, startTime: [number, number]) {
    const diff = process.hrtime(startTime);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    this.counter
      .labels({
        method: this.method,
        baseUrl: this.baseURL + this.url,
        statusCode,
      })
      .inc();
    this.histogram
      .labels({
        method: this.method,
        baseUrl: this.baseURL + this.url,
        statusCode,
      })
      .observe(time);
  }

  protected async after(result: AxiosResponse, startTime: [number, number]) {
    this.log(result.status, startTime);
  }

  protected async catch(e: Error | AxiosError, startTime: [number, number]) {
    if ('response' in e) this.log(e!.response!.status, startTime);
  }
}
