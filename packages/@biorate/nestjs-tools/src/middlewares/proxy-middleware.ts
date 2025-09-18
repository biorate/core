import http from 'http';
import type { ServerOptions } from 'http-proxy';
import { pick, omit } from 'lodash';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Options, RequestHandler } from 'http-proxy-middleware/dist/types';
import { Injectable } from '@nestjs/common';
import { counter, Counter, Histogram, Prometheus } from '@biorate/prometheus';
import { time } from '@biorate/tools';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';

@Injectable()
export class ProxyPrometheusMiddleware {
  @inject(Types.Config) private config: IConfig;

  @counter({
    name: 'http_proxy_server_requests_seconds_count',
    help: 'Http proxy server requests count',
    labelNames: ['method', 'uri', 'status'],
  })
  private counter: Counter;

  private handler: RequestHandler;

  private time = new WeakMap<Request, { time: () => number }>();

  private static histogram: Histogram;

  public static create(options?: Options) {
    return new this(options).handler;
  }

  private constructor(options: Options = {}) {
    const { onProxyReq, onProxyRes } = pick(options, 'onProxyReq', 'onProxyRes');
    if (!ProxyPrometheusMiddleware.histogram)
      ProxyPrometheusMiddleware.histogram = new Histogram({
        name: 'http_proxy_server_requests_seconds',
        help: 'Http proxy server requests seconds bucket',
        labelNames: ['method', 'uri', 'status'],
        buckets: this.config.get<number[]>(
          'ProxyPrometheusMiddleware.histogram.buckets',
          [0.005, 0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 1, 2, 3, 5, 10],
        ),
        registers: [Prometheus.registry],
      });
    this.handler = createProxyMiddleware({
      ...omit(options, 'onProxyReq', 'onProxyRes'),
      onProxyReq: (
        proxyReq: http.ClientRequest,
        req: Request,
        res: Response,
        options: ServerOptions,
      ) => {
        this.time.set(req, { time: time.diff() });
        return onProxyReq?.(proxyReq, req, res, options);
      },
      onProxyRes: (proxyRes: http.IncomingMessage, req: Request, res: Response) => {
        const diff = this.time.get(req);
        this.counter
          .labels({
            method: req.method,
            uri: req.baseUrl,
            status: res.statusCode,
          })
          .inc();
        ProxyPrometheusMiddleware.histogram
          .labels({
            method: req.method,
            uri: req.baseUrl,
            status: res.statusCode,
          })
          .observe(time.msTo(diff!.time(), 's'));
        return onProxyRes?.(proxyRes, req, res);
      },
    });
  }
}
