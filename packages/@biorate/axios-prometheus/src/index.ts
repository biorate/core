import stringify from 'json-stringify-safe';
import { readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { path, time as timeTools } from '@biorate/tools';
import { container, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Axios, AxiosError, AxiosResponse, IAxiosFetchOptions } from '@biorate/axios';
import { counter, Counter, Histogram, Prometheus } from '@biorate/prometheus';
import { trace, Span } from '@biorate/opentelemetry';
import { get, set, pick } from 'lodash-es';

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

  static #histogram: Histogram;

  protected get histogram() {
    if (!AxiosPrometheus.#histogram)
      AxiosPrometheus.#histogram = new Histogram({
        name: 'http_client_requests_seconds',
        help: 'Http client requests seconds bucket',
        labelNames: ['method', 'uri', 'status'],
        buckets: this.config.get<number[]>(
          'AxiosPrometheus.histogram.buckets',
          [0.005, 0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 1, 2, 3, 5, 10],
        ),
        registers: [Prometheus.registry],
      });
    return AxiosPrometheus.#histogram;
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
    return typeof data === 'object' ? stringify(data) : String(data);
  }
  /**
   * @description Check need to trace
   */
  protected needTrace(url: string, span?: Span) {
    if (!span) return false;
    const excluded = this.config.get<(string | RegExp)[]>(
      'AxiosPrometheus.tracing.excluded',
      [],
    );
    for (const item of excluded) {
      if (typeof item === 'string' && url.includes(item)) return false;
      if (item instanceof RegExp && item.test(url)) return false;
    }
    return true;
  }
  /**
   * @description Get full url = baseURL + url
   */
  protected fullUrl(params?: IAxiosFetchOptions) {
    return params?.baseURL ?? '' + params?.url ?? '';
  }
  /**
   * @description Aliases accepted in `tracing.excludedAttributes` for aspect matching
   */
  protected static aspectAliases: Record<string, string> = {
    'request.url': 'url',
    'request.method': 'method',
    'request.headers': 'headers',
    'request.body': 'body',
    'request.params': 'params',
    'request.query': 'query',
    statusCode: 'response.statusCode',
    data: 'response.data',
  };
  /**
   * @description Normalize an aspect name to its canonical form
   */
  protected static normalizeAspect(name: string) {
    const aliased = get(AxiosPrometheus.aspectAliases, name) as string | undefined;
    if (aliased) return aliased;
    if (name.startsWith('request.')) return name.slice('request.'.length);
    return name;
  }
  /**
   * @description Check need to trace a concrete span aspect
   * (`AxiosPrometheus.tracing.excludedAttributes` globally and
   * `AxiosPrometheus.tracing.excludedByURL` per-URL). An excluded item also
   * matches aspect groups by prefix, e.g. `response` excludes
   * `response.headers`, `response.statusCode` and `response.data`.
   */
  protected needAttribute(url: string, name: string) {
    const aspect = AxiosPrometheus.normalizeAspect(name);
    const match = (list: string[]) =>
      list.some((item) => {
        const target = AxiosPrometheus.normalizeAspect(item);
        return aspect === target || aspect.startsWith(`${target}.`);
      });
    if (
      match(this.config.get<string[]>('AxiosPrometheus.tracing.excludedAttributes', []))
    )
      return false;
    const byUrl = this.config.get<{ url: string | RegExp; attributes: string[] }[]>(
      'AxiosPrometheus.tracing.excludedByURL',
      [],
    );
    for (const entry of byUrl) {
      const hit =
        typeof entry?.url === 'string'
          ? url.includes(entry.url)
          : entry?.url instanceof RegExp && entry.url.test(url);
      if (!hit) continue;
      if (match(entry?.attributes ?? [])) return false;
    }
    return true;
  }

  protected async before(params?: IAxiosFetchOptions, meta?: Record<string, unknown>) {
    await super.before(params);
    const tracer = trace.getTracer(this.constructor.name);
    tracer.startActiveSpan(
      `[${this.constructor.name}] ${this.url ?? ''}`,
      async (span) => {
        const url = this.fullUrl(params);
        if (!this.needTrace(url, span)) return void span.end();
        meta!.span = span;
        if (this.needAttribute(url, 'url'))
          span.setAttribute('outgoing.request.url', this.stringify(url));
        if (this.needAttribute(url, 'body'))
          span.setAttribute('outgoing.request.body', this.stringify(params?.data));
        if (this.needAttribute(url, 'headers'))
          span.setAttribute('outgoing.request.headers', this.stringify(params?.headers));
        if (this.needAttribute(url, 'method'))
          span.setAttribute('outgoing.request.method', this.stringify(params?.method));
        if (this.needAttribute(url, 'params'))
          span.setAttribute('outgoing.request.params', this.stringify(params?.path));
        if (this.needAttribute(url, 'query'))
          span.setAttribute('outgoing.request.query', this.stringify(params?.params));
        span.setAttribute('SpanKind', 'CLIENT');
      },
    );
  }

  protected async after(
    result: AxiosResponse,
    startTime: [number, number],
    params: IAxiosFetchOptions,
    meta?: Record<string, unknown>,
  ) {
    await super.after(result, startTime, params);
    this.log(result.status, startTime);
    const span = <Span>meta?.span;
    const url = this.fullUrl(params);
    if (!this.needTrace(url, span)) return;
    if (this.needAttribute(url, 'response.headers'))
      span.setAttribute('outgoing.response.headers', this.stringify(result.headers));
    if (this.needAttribute(url, 'response.statusCode'))
      span.setAttribute('outgoing.response.statusCode', this.stringify(result.status));
    if (this.needAttribute(url, 'response.data'))
      span.setAttribute('outgoing.response.data', this.stringify(result.data));
  }

  protected async catch(
    e: Error | AxiosError,
    startTime: [number, number],
    params: IAxiosFetchOptions,
    meta?: Record<string, unknown>,
  ) {
    await super.catch(e, startTime, params);
    if (!('response' in e)) return;
    this.log(e!.response!.status, startTime);
    const span = <Span>meta?.span;
    const url = this.fullUrl(params);
    if (!this.needTrace(url, span)) return;
    if (this.needAttribute(url, 'response.headers'))
      span.setAttribute(
        'outgoing.response.headers',
        this.stringify(e!.response!.headers),
      );
    if (this.needAttribute(url, 'response.statusCode'))
      span.setAttribute(
        'outgoing.response.statusCode',
        this.stringify(e!.response!.status),
      );
    if (this.needAttribute(url, 'response.data'))
      span.setAttribute('outgoing.response.data', this.stringify(e!.response!.data));
  }

  protected async finally(
    startTime: [number, number],
    params?: IAxiosFetchOptions,
    meta?: Record<string, unknown>,
  ) {
    (<Span>meta?.span)?.end?.();
    return super.finally(startTime, params, meta);
  }
}
