import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SpanStatusCode, trace } from '@biorate/opentelemetry';
import type { Span } from '@biorate/opentelemetry';
import { TracingInterceptor } from '../src';
import {
  exporter,
  provider,
  makeContext,
  nextOf,
  nextThrow,
  setTracingExcluded,
  setTracingExcludedAttributes,
  setTracingExcludedByUrl,
  resetTracingConfig,
} from './__mocks__/tracing-interceptor';

// Suppress @biorate/opentelemetry side effect (NodeSDK.start with gRPC exporter):
// replace the module with a clean re-export of @opentelemetry/api.
vi.mock('@biorate/opentelemetry', async () => await import('@opentelemetry/api'));

const tracer = provider.getTracer('test');

async function withActiveSpan<T>(run: (span: Span) => T): Promise<T> {
  const span = tracer.startSpan('incoming');
  const spy = vi.spyOn(trace, 'getActiveSpan').mockReturnValue(span);
  try {
    return await run(span);
  } finally {
    spy.mockRestore();
  }
}

describe('TracingInterceptor', () => {
  beforeAll(() => trace.setGlobalTracerProvider(provider));
  beforeEach(() => {
    exporter.reset();
    resetTracingConfig();
  });

  it('ends and exports the span with request/response attributes on happy path', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
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
    await withActiveSpan(async (span) => {
      await expect(
        firstValueFrom(interceptor.intercept(makeContext('http'), nextThrow(error))),
      ).rejects.toBe(error);
      span.end();
    });
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
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http', '/skip/me'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes['incoming.request.url']).toBeUndefined();
  });

  it('ends the span and passes the observable through for ws and rpc', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    for (const type of ['ws', 'rpc']) {
      exporter.reset();
      await withActiveSpan(async (span) => {
        const result = await firstValueFrom(
          interceptor.intercept(makeContext(type), nextOf({ data: 'ok' })),
        );
        expect(result).toEqual({ data: 'ok' });
        span.end();
      });
      const spans = exporter.getFinishedSpans();
      expect(spans).toHaveLength(1);
      expect(Object.keys(spans[0].attributes)).toHaveLength(0);
      exporter.reset();
    }
  });

  it('passes the handler result through untouched when no span is active', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    const spy = vi.spyOn(trace, 'getActiveSpan').mockReturnValue(undefined);
    try {
      const result = await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      expect(result).toEqual({ data: 'ok' });
    } finally {
      spy.mockRestore();
    }
    expect(exporter.getFinishedSpans()).toHaveLength(0);
  });

  it('decorates but does not end the caller-owned active span', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcluded([]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      // interceptor must not close a span it does not own
      expect(exporter.getFinishedSpans()).toHaveLength(0);
      span.end();
    });
    expect(exporter.getFinishedSpans()).toHaveLength(1);
    expect(exporter.getFinishedSpans()[0].attributes['incoming.request.url']).toBe(
      '/test',
    );
  });

  it('keeps every attribute when nothing is excluded (pin)', async () => {
    const interceptor = new TracingInterceptor();
    resetTracingConfig();
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(Object.keys(attrs).sort()).toEqual([
      'incoming.request.body',
      'incoming.request.headers',
      'incoming.request.method',
      'incoming.request.params',
      'incoming.request.query',
      'incoming.request.url',
      'incoming.response.data',
      'incoming.response.headers',
      'incoming.response.statusCode',
    ]);
  });

  it('excludes only listed aspects globally', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedAttributes(['body', 'response.data']);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.request.body');
    expect(attrs).not.toHaveProperty('incoming.response.data');
    expect(attrs).toHaveProperty('incoming.request.url');
    expect(attrs).toHaveProperty('incoming.request.method');
    expect(attrs).toHaveProperty('incoming.response.statusCode');
  });

  it('excludes the whole response group by prefix', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedAttributes(['response']);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.response.data');
    expect(attrs).not.toHaveProperty('incoming.response.statusCode');
    expect(attrs).not.toHaveProperty('incoming.response.headers');
    expect(attrs).toHaveProperty('incoming.request.url');
    expect(attrs).toHaveProperty('incoming.request.body');
  });

  it('excludes aspects via short aliases (data, statusCode)', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedAttributes(['data', 'statusCode']);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.response.data');
    expect(attrs).not.toHaveProperty('incoming.response.statusCode');
    expect(attrs).toHaveProperty('incoming.response.headers');
  });

  it('excludes aspects per matching url only (string inclusion)', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedByUrl([{ url: '/skip', attributes: ['body', 'response'] }]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http', '/skip/me'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.request.body');
    expect(attrs).not.toHaveProperty('incoming.response.data');
    expect(attrs).not.toHaveProperty('incoming.response.statusCode');
    expect(attrs).toHaveProperty('incoming.request.url');
    expect(attrs).toHaveProperty('incoming.request.method');
  });

  it('keeps aspects for non-matching urls', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedByUrl([{ url: '/skip', attributes: ['body'] }]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http', '/other'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).toHaveProperty('incoming.request.body');
  });

  it('excludes aspects when the url contains the pattern mid-string', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedByUrl([{ url: 'files', attributes: ['body'] }]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(
          makeContext('http', '/api/files/1'),
          nextOf({ data: 'ok' }),
        ),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.request.body');
    expect(attrs).toHaveProperty('incoming.request.url');
  });

  it('excludes aspects per matching url (regexp)', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedByUrl([{ url: /^\/files\//, attributes: ['headers'] }]);
    await withActiveSpan(async (span) => {
      await firstValueFrom(
        interceptor.intercept(makeContext('http', '/files/1'), nextOf({ data: 'ok' })),
      );
      span.end();
    });
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('incoming.request.headers');
    expect(attrs).toHaveProperty('incoming.request.url');
  });

  it('excludes response aspects on the error path', async () => {
    const interceptor = new TracingInterceptor();
    setTracingExcludedAttributes(['response.data', 'errorCode']);
    const error = { code: 'E_TEST', response: { data: 'boom' } };
    await withActiveSpan(async (span) => {
      await expect(
        firstValueFrom(interceptor.intercept(makeContext('http'), nextThrow(error))),
      ).rejects.toBe(error);
      span.end();
    });
    const spans = exporter.getFinishedSpans();
    expect(spans[0].attributes).not.toHaveProperty('incoming.response.data');
    expect(spans[0].attributes).not.toHaveProperty('incoming.response.errorCode');
    expect(spans[0].attributes).toHaveProperty('incoming.response.statusCode');
    expect(spans[0].status.code).toBe(SpanStatusCode.ERROR);
  });
});
