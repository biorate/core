import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { Config } from '@biorate/config';
import type { IConfig } from '@biorate/config';
import { container, Types } from '@biorate/inversion';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();

/**
 * Set the excluded URL patterns for TracingInterceptor tests.
 * Uses `.set()` (full replacement) — NOT `.merge()` — because lodash merge
 * doesn't replace arrays element-wise (merging [] into ['/skip'] keeps ['/skip']).
 */
export function setTracingExcluded(patterns: (string | RegExp)[]) {
  container.get<IConfig>(Types.Config).set('TracingInterceptor.excluded', patterns);
}

export const exporter = new InMemorySpanExporter();

export const provider = new BasicTracerProvider({
  spanProcessors: [new SimpleSpanProcessor(exporter)],
});

export const makeContext = (type: string, url = '/test') => <ExecutionContext>(<unknown>{
    getType: () => type,
    switchToHttp: () => ({
      getRequest: () => ({
        url,
        method: 'GET',
        headers: { 'x-test': '1' },
        body: { foo: 'bar' },
        params: { id: '1' },
        query: { q: '1' },
      }),
      getResponse: () => ({ headers: {}, statusCode: 200 }),
    }),
  });

export const nextOf = (data: unknown): CallHandler => ({ handle: () => of(data) });

export const nextThrow = (e: unknown): CallHandler => ({
  handle: () => throwError(() => e),
});
