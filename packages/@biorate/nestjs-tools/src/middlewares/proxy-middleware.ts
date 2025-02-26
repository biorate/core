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
    labelNames: ['method', 'uri', 'status'],
  })
  private counter: Counter;

  @histogram({
    name: 'http_proxy_server_requests_seconds',
    help: 'Http proxy server requests seconds bucket',
    labelNames: ['method', 'uri', 'status'],
    buckets: [0.005, 0.01, 0.02, 0.05, 0.1, 0.3, 0.5, 1, 2, 3, 5, 10],
  })
  private histogram: Histogram;

  private handler: RequestHandler;

  private time = new WeakMap<Request, { time: () => number }>();

  public static create(options?: Options) {
    return new this(options).handler;
  }

  private constructor(options: Options = {}) {
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
            uri: req.baseUrl,
            status: res.statusCode,
          })
          .inc();
        this.histogram
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
