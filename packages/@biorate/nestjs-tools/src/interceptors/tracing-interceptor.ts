import { tap } from 'rxjs';
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
    return typeof data === 'object' ? JSON.stringify(data) : String(data);
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
    return next.handle().pipe(
      tap((data) => {
        span.setAttribute('request.url', this.stringify(req.url));
        span.setAttribute('request.body', this.stringify(req.body));
        span.setAttribute('request.headers', this.stringify(req.headers));
        span.setAttribute('request.method', this.stringify(req.method));
        span.setAttribute('request.params', this.stringify(req.params));
        span.setAttribute('request.query', this.stringify(req.query));
        span.setAttribute('response.headers', this.stringify(res.headers));
        span.setAttribute('response.statusCode', this.stringify(res.statusCode));
        span.setAttribute('response.data', this.stringify(data));
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
