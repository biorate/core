// @ts-ignore
import * as onHeaders from 'on-headers';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { counter, Counter } from '@biorate/prometheus';
import { Request, Response, NextFunction } from 'express';
import { RoutesInterceptor } from '../interceptors';

@Injectable()
export class RequestCountMiddleware implements NestMiddleware {
  @counter({
    name: 'http_server_requests_seconds_count',
    help: 'Http server requests count',
    labelNames: ['method', 'url', 'status'],
  })
  private counter: Counter;

  public use(req: Request, res: Response, next: NextFunction) {
    onHeaders(res, () => {
      const route = RoutesInterceptor.map.get(req);
      this.counter
        .labels({
          method: req.method,
          url: route?.path ?? (req.baseUrl || req.originalUrl),
          status: res.statusCode,
        })
        .inc();
    });
    next();
  }
}
