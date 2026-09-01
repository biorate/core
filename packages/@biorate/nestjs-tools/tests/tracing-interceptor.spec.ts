import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SpanStatusCode, trace } from '@biorate/opentelemetry';
import { TracingInterceptor } from '../src';
import {
  exporter,
  provider,
  makeContext,
  nextOf,
  nextThrow,
  setTracingExcluded,
} from './__mocks__/tracing-interceptor';

// Suppress @biorate/opentelemetry side effect (NodeSDK.start with gRPC exporter):
// replace the module with a clean re-export of @opentelemetry/api.
vi.mock('@biorate/opentelemetry', async () => await import('@opentelemetry/api'));

describe('TracingInterceptor', () => {
  beforeAll(() => trace.setGlobalTracerProvider(provider));
  beforeEach(() => exporter.reset());

  it('ends and exports the span with request/response attributes on happy path', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    await firstValueFrom(
      interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
    );
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const span = spans[0];
    expect(span.name).toBe('incoming');
    expect(span.attributes['incoming.request.url']).toBe('/test');
    expect(span.attributes['incoming.request.method']).toBe('GET');
    expect(span.attributes['incoming.request.body']).toBe('{"foo":"bar"}');
    expect(span.attributes['incoming.response.statusCode']).toBe('200');
    expect(span.attributes['incoming.response.data']).toBe('{"data":"ok"}');
  });

  it('records exception and sets ERROR status on error path', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    const error = { code: 'E_TEST', response: { data: 'boom' } };
    await expect(
      firstValueFrom(interceptor.intercept(makeContext('http'), nextThrow(error))),
    ).rejects.toBe(error);
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const span = spans[0];
    expect(span.attributes['incoming.response.errorCode']).toBe('E_TEST');
    expect(span.attributes['incoming.response.data']).toBe('boom');
    expect(span.status.code).toBe(SpanStatusCode.ERROR);
    expect(span.events.some((ev) => ev.name === 'exception')).toBe(true);
  });

  it('ends an attribute-less span for excluded urls', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded(['/skip']);
    await firstValueFrom(
      interceptor.intercept(makeContext('http', '/skip/me'), nextOf({ data: 'ok' })),
    );
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes['incoming.request.url']).toBeUndefined();
  });

  it('ends the span and passes the observable through for ws and rpc', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    for (const type of ['ws', 'rpc']) {
      exporter.reset();
      const result = await firstValueFrom(
        interceptor.intercept(makeContext(type), nextOf({ data: 'ok' })),
      );
      expect(result).toEqual({ data: 'ok' });
      const spans = exporter.getFinishedSpans();
      expect(spans).toHaveLength(1);
      expect(Object.keys(spans[0].attributes)).toHaveLength(0);
      exporter.reset();
    }
  });
});
