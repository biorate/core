import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import nock from 'nock';
import {
  exporter,
  TestService,
  setTracingExcluded,
  enableInMemoryTracing,
  URL,
} from './__mocks__/tracing';

describe('@biorate/axios-prometheus / tracing', () => {
  beforeAll(() => {
    enableInMemoryTracing();
  });

  afterEach(() => {
    exporter.reset();
    nock.cleanAll();
  });

  it('should create a span with outgoing request attributes', async () => {
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    const attrs = spans[0].attributes;
    expect(attrs['outgoing.request.url']).toBe(URL);
    expect(attrs['outgoing.request.method']).toBe('get');
    expect(attrs['SpanKind']).toBe('CLIENT');
  });

  it('should add response attributes on success', async () => {
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(JSON.parse(<string>attrs['outgoing.response.statusCode'])).toBe(200);
    expect(JSON.parse(<string>attrs['outgoing.response.data'])).toEqual({
      message: 'ok',
    });
  });

  it('should add response attributes on error', async () => {
    nock(URL)
      .get('/')
      .reply(500, { error: 'boom' }, { 'content-type': 'application/json' });
    try {
      await TestService.fetch();
    } catch {}
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(JSON.parse(<string>attrs['outgoing.response.statusCode'])).toBe(500);
    expect(JSON.parse(<string>attrs['outgoing.response.data'])).toEqual({
      error: 'boom',
    });
  });

  it('should not trace excluded urls (string)', async () => {
    setTracingExcluded([URL]);
    nock(URL).get('/').reply(200, {});
    await TestService.fetch();
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes).not.toHaveProperty('outgoing.request.url');
  });

  it('should not trace excluded urls (regexp)', async () => {
    setTracingExcluded([/google\.com/]);
    nock(URL).get('/').reply(200, {});
    await TestService.fetch();
    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].attributes).not.toHaveProperty('outgoing.request.url');
  });

  it('should set span name to the request url', async () => {
    nock(URL).get('/').reply(200, {});
    await TestService.fetch();
    expect(exporter.getFinishedSpans()[0].name).toBe('/');
  });
});
