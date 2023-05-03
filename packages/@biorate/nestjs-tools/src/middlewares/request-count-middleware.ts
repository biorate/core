// @ts-ignore
import * as onHeaders from 'on-headers';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { counter, Counter } from '@biorate/prometheus';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { Request, Response, NextFunction } from 'express';
import { RoutesInterceptor } from '../interceptors';

@Injectable()
export class RequestCountMiddleware implements NestMiddleware {
  @inject(Types.Config) private config: IConfig;

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
          url:
            route?.path ??
            this.config.get<boolean>(
              'app.middleware.RequestCountMiddleware.log-base-url',
              false,
            )
              ? '/'
              : req.baseUrl || req.originalUrl,
          status: res.statusCode,
        })
        .inc();
    });
    next();
  }
}
