import stringify from 'json-stringify-safe';
import { tap, catchError } from 'rxjs';
import { trace, Span } from '@biorate/opentelemetry';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
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
      if (typeof item === 'string' && url.startsWith(item)) return true;
      if (item instanceof RegExp && item.test(url)) return true;
    }
    return false;
  }

  protected http(span: Span, context: ExecutionContext, next: CallHandler) {
    const host = context.switchToHttp();
    const req = host.getRequest();
    const res = host.getResponse();
    if (this.excluded(req.url)) return next.handle();
    span.setAttribute('incoming.request.url', this.stringify(req.url));
    span.setAttribute('incoming.request.body', this.stringify(req.body));
    span.setAttribute('incoming.request.headers', this.stringify(req.headers));
    span.setAttribute('incoming.request.method', this.stringify(req.method));
    span.setAttribute('incoming.request.params', this.stringify(req.params));
    span.setAttribute('incoming.request.query', this.stringify(req.query));
    return next.handle().pipe(
      catchError((e) => {
        span.setAttribute('incoming.response.headers', this.stringify(res.headers));
        span.setAttribute('incoming.response.statusCode', this.stringify(res.statusCode));
        span.setAttribute('incoming.response.errorCode', this.stringify(e.code));
        span.setAttribute('incoming.response.data', this.stringify(e?.response?.data));
        throw e;
      }),
      tap((data) => {
        span.setAttribute('incoming.response.headers', this.stringify(res.headers));
        span.setAttribute('incoming.response.statusCode', this.stringify(res.statusCode));
        span.setAttribute('incoming.response.data', this.stringify(data));
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
