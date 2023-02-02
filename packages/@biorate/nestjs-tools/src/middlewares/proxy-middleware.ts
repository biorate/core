import http from 'http';
import * as httpProxy from 'http-proxy';
import { pick, omit } from 'lodash';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Options, RequestHandler } from 'http-proxy-middleware/dist/types';
import { Injectable } from '@nestjs/common';
import { counter, histogram, Counter, Histogram } from '@biorate/prometheus';
import { time } from '@biorate/tools';

@Injectable()
export class ProxyPrometheusMiddleware {
  @counter({
    name: 'http_proxy_server_requests_seconds_count',
    help: 'Http proxy server requests count',
    labelNames: ['method', 'url', 'status'],
  })
  private counter: Counter;

  @histogram({
    name: 'http_proxy_server_requests_seconds',
    help: 'Http proxy server requests seconds bucket',
    labelNames: ['method', 'url', 'status'],
    buckets: [5, 10, 20, 50, 100, 300, 500, 1000, 2000, 3000, 5000, 10000],
  })
  private histogram: Histogram;

  private handler: RequestHandler;

  private time = new WeakMap<Request, { time: () => number }>();

  public static create(options?: Options) {
    return new this(options).handler;
  }

  private constructor(options?: Options) {
    const { onProxyReq, onProxyRes } = pick(options, 'onProxyReq', 'onProxyRes');
    this.handler = createProxyMiddleware({
      ...omit(options, 'onProxyReq', 'onProxyRes'),
      onProxyReq: (
        proxyReq: http.ClientRequest,
        req: Request,
        res: Response,
        options: httpProxy.ServerOptions,
      ) => {
        this.time.set(req, { time: time.diff() });
        return onProxyReq?.(proxyReq, req, res, options);
      },
      onProxyRes: (proxyRes: http.IncomingMessage, req: Request, res: Response) => {
        const diff = this.time.get(req);
        this.counter
          .labels({
            method: req.method,
            url: req.baseUrl,
            status: res.statusCode,
          })
          .inc();
        this.histogram
          .labels({
            method: req.method,
            url: req.baseUrl,
            status: res.statusCode,
          })
          .observe(diff!.time());
        return onProxyRes?.(proxyRes, req, res);
      },
    });
  }
}
