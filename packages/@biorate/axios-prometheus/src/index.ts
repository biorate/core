// noinspection TypeScriptUnresolvedVariable

import { readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { path, time as timeTools } from '@biorate/tools';
import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Axios, AxiosError, AxiosResponse, IAxiosFetchOptions } from '@biorate/axios';
import { counter, Counter, histogram, Histogram } from '@biorate/prometheus';
import { trace, Span } from '@biorate/opentelemetry';
import { get, set, pick } from 'lodash';

export * from '@biorate/axios';

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
  protected static mockFields = ['data', 'status', 'statusText'];

  protected static mockFileName(name: string) {
    return `Axios.${name}.snap`;
  }

  protected static checkMockDir(directory: string) {
    try {
      const dir = path.create(process.cwd(), directory);
      const stats = statSync(dir);
      if (!stats.isDirectory()) return null;
      return dir;
    } catch {
      return null;
    }
  }

  protected static mockFilePath(filename?: string) {
    let directory = (<IConfig>container.get<IConfig>(Types.Config)).get<string | null>(
      'axios.mock.directory',
      null,
    );
    if (!directory) directory = this.checkMockDir('test');
    if (!directory) directory = this.checkMockDir('tests');
    if (!directory) directory = process.cwd();
    return path.create(directory, '__snapshots__', filename ?? '');
  }

  protected static getMockData(instance: Axios, filename: string) {
    return JSON.parse(readFileSync(this.mockFilePath(filename), 'utf8'));
  }

  protected static getMock<T = any, D = any>(
    instance: Axios,
    options?: IAxiosFetchOptions,
  ): undefined | AxiosResponse<T, D> {
    const filename = this.mockFileName(instance.constructor.name);
    try {
      return get(
        this.getMockData(instance, filename),
        `${instance.constructor.name}.${JSON.stringify(options)}`,
      );
    } catch (e) {
      console.warn(
        `Axios mock snap file [${filename}] doesn't exists, or corrupted., because of [${
          (<Error>e)?.message
        }]`,
      );
    }
  }

  protected static setMock<T = any, D = any>(
    instance: Axios,
    result: AxiosResponse<T, D>,
    options?: IAxiosFetchOptions,
  ) {
    let data: Record<string, unknown>;
    const filename = this.mockFileName(instance.constructor.name);
    try {
      data = this.getMockData(instance, filename);
    } catch {
      data = {};
    }
    set(
      data,
      `${instance.constructor.name}.${JSON.stringify(options)}`,
      pick(result, ...this.mockFields),
    );
    try {
      mkdirSync(this.mockFilePath(), { recursive: true });
    } catch {}
    try {
      writeFileSync(
        this.mockFilePath(filename),
        JSON.stringify(data, null, '  '),
        'utf8',
      );
    } catch (e) {
      console.warn(
        `Can't write Axios mock snap file [${filename}], because of [${
          (<Error>e)?.message
        }]`,
      );
    }
  }

  protected get config() {
    return container.get<IConfig>(Types.Config);
  }

  @counter({
    name: 'http_client_requests_seconds_count',
    help: 'Http client requests count',
    labelNames: ['method', 'uri', 'status'],
  })
  protected counter: Counter;

  @histogram({
    name: 'http_client_requests_seconds',
    help: 'Http client requests seconds bucket',
    labelNames: ['method', 'uri', 'status'],
    buckets: [0.005, 0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 1, 2, 3, 5, 10],
  })
  protected histogram: Histogram;

  public abstract baseURL: string;
  public abstract url: string;
  public abstract method: string;
  /**
   * @description Get start time method
   */
  protected getStartTime(): [number, number] {
    return process.hrtime();
  }
  /**
   * @description Log method
   */
  protected log(statusCode: number, startTime: [number, number]) {
    const diff = process.hrtime(startTime);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    const msTo = timeTools.msTo;
    this.counter
      .labels({
        method: this.method,
        uri: this.baseURL + this.url,
        status: statusCode,
      })
      .inc();
    this.histogram
      .labels({
        method: this.method,
        uri: this.baseURL + this.url,
        status: statusCode,
      })
      .observe(msTo(time, 's'));
  }
  /**
   * @description Stringify data
   */
  protected stringify(data: unknown) {
    return typeof data === 'object' ? JSON.stringify(data) : String(data);
  }

  protected async before(params?: IAxiosFetchOptions) {
    await super.before(params);
    const span = trace.getActiveSpan();
    if (!span) return;
    span.setAttribute(
      'request.url',
      this.stringify(params?.baseURL ?? '' + params?.url ?? ''),
    );
    span.setAttribute('request.body', this.stringify(params?.data));
    span.setAttribute('request.headers', this.stringify(params?.headers));
    span.setAttribute('request.method', this.stringify(params?.method));
    span.setAttribute('request.params', this.stringify(params?.path));
    span.setAttribute('request.query', this.stringify(params?.params));
  }

  protected async after(
    result: AxiosResponse,
    startTime: [number, number],
    params: IAxiosFetchOptions,
  ) {
    await super.after(result, startTime, params);
    this.log(result.status, startTime);
    const span = trace.getActiveSpan();
    if (!span) return;
    span.setAttribute('response.headers', this.stringify(result.headers));
    span.setAttribute('response.statusCode', this.stringify(result.status));
    span.setAttribute('response.data', this.stringify(result.data));
  }

  protected async catch(
    e: Error | AxiosError,
    startTime: [number, number],
    params: IAxiosFetchOptions,
  ) {
    await super.catch(e, startTime, params);
    if (!('response' in e)) return;
    this.log(e!.response!.status, startTime);
    const span = trace.getActiveSpan();
    if (!span) return;
    span.setAttribute('response.headers', this.stringify(e!.response!.headers));
    span.setAttribute('response.statusCode', this.stringify(e!.response!.status));
    span.setAttribute('response.data', this.stringify(e!.response!.data));
  }
}
