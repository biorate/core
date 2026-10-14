import stringify from 'json-stringify-safe';
import { tap, catchError } from 'rxjs';
import { trace, Span, SpanStatusCode } from '@biorate/opentelemetry';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { get } from 'lodash-es';

/**
 * @description
 * Interceptor that adds OpenTelemetry span attributes for incoming HTTP requests.
 * Captures URL, body, headers, method, params, query, and response data.
 * Supports exclusion of certain URLs via config, as well as granular exclusion
 * of concrete span aspects — globally (`TracingInterceptor.excludedAttributes`)
 * or per-URL (`TracingInterceptor.excludedByURL`, string entries match by
 * substring inclusion, RegExp entries by test).
 *
 * @example
 * ```json
 * {
 *   "TracingInterceptor": {
 *     "excluded": ["/health"],
 *     "excludedAttributes": ["response.data"],
 *     "excludedByURL": [{ "url": "/files", "attributes": ["body", "response"] }]
 *   }
 * }
 * ```
 */
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  /**
   * @description Aliases accepted in exclusion lists for aspect matching
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
    errorCode: 'response.errorCode',
  };
  /**
   * @description Span attribute key for a canonical aspect name
   */
  protected static aspectKeys: Record<string, string> = {
    url: 'incoming.request.url',
    method: 'incoming.request.method',
    headers: 'incoming.request.headers',
    body: 'incoming.request.body',
    params: 'incoming.request.params',
    query: 'incoming.request.query',
    'response.headers': 'incoming.response.headers',
    'response.statusCode': 'incoming.response.statusCode',
    'response.data': 'incoming.response.data',
    'response.errorCode': 'incoming.response.errorCode',
  };
  /**
   * @description Normalize an aspect name to its canonical form
   */
  protected static normalizeAspect(name: string) {
    const aliased = get(TracingInterceptor.aspectAliases, name) as string | undefined;
    if (aliased) return aliased;
    if (name.startsWith('request.')) return name.slice('request.'.length);
    return name;
  }

  @inject(Types.Config) protected readonly config: IConfig;

  protected stringify(data: unknown) {
    return typeof data === 'object' ? stringify(data) : String(data);
  }

  protected excluded(url: string) {
    const excluded = this.config.get<(string | RegExp)[]>(
      'TracingInterceptor.excluded',
      [],
    );
    for (const item of excluded) {
      if (typeof item === 'string' && url.includes(item)) return true;
      if (item instanceof RegExp && item.test(url)) return true;
    }
    return false;
  }

  protected excludedAttribute(url: string, aspect: string) {
    const canonical = TracingInterceptor.normalizeAspect(aspect);
    const match = (list: string[]) =>
      list.some((item) => {
        const target = TracingInterceptor.normalizeAspect(item);
        return canonical === target || canonical.startsWith(`${target}.`);
      });
    if (match(this.config.get<string[]>('TracingInterceptor.excludedAttributes', [])))
      return true;
    const byUrl = this.config.get<{ url: string | RegExp; attributes: string[] }[]>(
      'TracingInterceptor.excludedByURL',
      [],
    );
    for (const entry of byUrl) {
      const hit =
        typeof entry?.url === 'string'
          ? url.includes(entry.url)
          : entry?.url instanceof RegExp && entry.url.test(url);
      if (!hit) continue;
      if (match(entry?.attributes ?? [])) return true;
    }
    return false;
  }

  protected attr(span: Span, url: string, aspect: string, value: unknown) {
    if (this.excludedAttribute(url, aspect)) return;
    span.setAttribute(TracingInterceptor.aspectKeys[aspect], this.stringify(value));
  }

  protected http(span: Span, context: ExecutionContext, next: CallHandler) {
    const host = context.switchToHttp();
    const req = host.getRequest();
    const res = host.getResponse();
    if (this.excluded(req.url)) return next.handle();
    this.attr(span, req.url, 'url', req.url);
    this.attr(span, req.url, 'body', req.body);
    this.attr(span, req.url, 'headers', req.headers);
    this.attr(span, req.url, 'method', req.method);
    this.attr(span, req.url, 'params', req.params);
    this.attr(span, req.url, 'query', req.query);
    return next.handle().pipe(
      catchError((e) => {
        this.attr(span, req.url, 'response.headers', res.headers);
        this.attr(span, req.url, 'response.statusCode', res.statusCode);
        this.attr(span, req.url, 'response.errorCode', e.code);
        this.attr(span, req.url, 'response.data', e?.response?.data);
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw e;
      }),
      tap((data) => {
        this.attr(span, req.url, 'response.headers', res.headers);
        this.attr(span, req.url, 'response.statusCode', res.statusCode);
        this.attr(span, req.url, 'response.data', data);
      }),
    );
  }

  protected ws(span: Span, context: ExecutionContext, next: CallHandler) {
    return next.handle();
  }

  protected rpc(span: Span, context: ExecutionContext, next: CallHandler) {
    return next.handle();
  }

  public intercept(context: ExecutionContext, next: CallHandler) {
    const span = trace.getActiveSpan();
    if (!span) return next.handle();
    const type = context.getType();
    return this[type](span, context, next);
  }
}
