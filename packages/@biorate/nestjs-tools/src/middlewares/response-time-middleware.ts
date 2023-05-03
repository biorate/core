// @ts-ignore
import * as onHeaders from 'on-headers';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { histogram, Histogram } from '@biorate/prometheus';
import { Request, Response, NextFunction } from 'express';
import { RoutesInterceptor } from '../interceptors';
import { time } from '@biorate/tools';

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  @inject(Types.Config) private config: IConfig;

  private readonly suffix: boolean;

  private readonly header: string;

  private readonly digits: number;

  @histogram({
    name: 'http_server_requests_seconds',
    help: 'Http server requests seconds bucket',
    labelNames: ['method', 'url', 'status'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  private histogram: Histogram;

  public constructor() {
    this.suffix = this.config.get<boolean>(
      'app.middleware.ResponseTimeMiddleware.suffix',
      true,
    );
    this.header = this.config.get<string>(
      'app.middleware.ResponseTimeMiddleware.header',
      'x-response-time',
    );
    this.digits = this.config.get<number>(
      'app.middleware.ResponseTimeMiddleware.digits',
      3,
    );
  }

  public use(req: Request, res: Response, next: NextFunction) {
    const diff = time.diff();
    onHeaders(res, () => {
      const time = diff();
      const route = RoutesInterceptor.map.get(req);
      this.histogram
        .labels({
          method: req.method,
          url:
            route?.path ??
            this.config.get<boolean>(
              'app.middleware.ResponseTimeMiddleware.log-base-url',
              false,
            )
              ? '/'
              : req.baseUrl || req.originalUrl,
          status: res.statusCode,
        })
        .observe(time);
      res.setHeader(this.header, time.toFixed(this.digits) + (this.suffix ? 'ms' : ''));
    });
    next();
  }
}
