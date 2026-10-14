import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import nock from 'nock';
import {
  exporter,
  TestService,
  setTracingExcluded,
  setTracingExcludedAttributes,
  setTracingExcludedByUrl,
  enableInMemoryTracing,
  URL,
} from './__mocks__/tracing';

describe('@biorate/axios-prometheus / tracing', () => {
  beforeAll(() => {
    enableInMemoryTracing();
  });

  afterEach(() => {
    exporter.reset();
    setTracingExcluded([]);
    setTracingExcludedAttributes([]);
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
    expect(exporter.getFinishedSpans()[0].name).toBe('[TestService] /');
  });

  it('should keep every attribute when nothing is excluded (pin)', async () => {
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(Object.keys(attrs).sort()).toEqual([
      'SpanKind',
      'outgoing.request.body',
      'outgoing.request.headers',
      'outgoing.request.method',
      'outgoing.request.params',
      'outgoing.request.query',
      'outgoing.request.url',
      'outgoing.response.data',
      'outgoing.response.headers',
      'outgoing.response.statusCode',
    ]);
  });

  it('should exclude only listed aspects', async () => {
    setTracingExcludedAttributes(['response.data']);
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(attrs).toHaveProperty('outgoing.response.statusCode');
    expect(attrs).toHaveProperty('outgoing.response.headers');
    expect(attrs).toHaveProperty('outgoing.request.url');
  });

  it('should exclude the whole response group by prefix', async () => {
    setTracingExcludedAttributes(['response']);
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(attrs).not.toHaveProperty('outgoing.response.statusCode');
    expect(attrs).not.toHaveProperty('outgoing.response.headers');
    expect(attrs).toHaveProperty('outgoing.request.url');
    expect(attrs).toHaveProperty('outgoing.request.body');
  });

  it('should exclude a request aspect via the request.* alias', async () => {
    setTracingExcludedAttributes(['request.body']);
    nock(URL).get('/').reply(200, { message: 'ok' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.request.body');
    expect(attrs).toHaveProperty('outgoing.request.url');
  });

  it('should exclude aspects via short aliases (data, statusCode)', async () => {
    setTracingExcludedAttributes(['data', 'statusCode']);
    nock(URL)
      .get('/')
      .reply(200, { message: 'ok' }, { 'content-type': 'application/json' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(attrs).not.toHaveProperty('outgoing.response.statusCode');
    expect(attrs).toHaveProperty('outgoing.response.headers');
  });

  it('should exclude response aspects on the error path', async () => {
    setTracingExcludedAttributes(['response.data']);
    nock(URL).get('/').reply(500, { error: 'boom' });
    try {
      await TestService.fetch();
    } catch {}
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(JSON.parse(<string>attrs['outgoing.response.statusCode'])).toBe(500);
  });

  it('should exclude aspects per matching url only (string inclusion)', async () => {
    setTracingExcludedByUrl([
      { url: 'https://cdn.example.com', attributes: ['response.data'] },
    ]);
    nock(URL).get('/').reply(200, { message: 'ok' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).toHaveProperty('outgoing.response.data');
    expect(attrs).toHaveProperty('outgoing.request.url');
  });

  it('should exclude aspects for a matching url (regexp)', async () => {
    setTracingExcludedByUrl([{ url: /cdn\.example\.com/, attributes: ['data'] }]);
    nock('https://cdn.example.com').get('/').reply(200, { message: 'ok' });
    const Service = class extends TestService {
      public baseURL = 'https://cdn.example.com';
    };
    await Service.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(attrs).toHaveProperty('outgoing.response.statusCode');
    expect(attrs).toHaveProperty('outgoing.request.url');
  });

  it('should keep aspects for non-matching urls', async () => {
    setTracingExcludedByUrl([{ url: 'https://cdn.example.com', attributes: ['data'] }]);
    nock(URL).get('/').reply(200, { message: 'ok' });
    await TestService.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).toHaveProperty('outgoing.response.data');
  });

  it('should exclude aspects when the url contains the pattern mid-string', async () => {
    setTracingExcludedByUrl([{ url: 'cdn.example.com', attributes: ['data'] }]);
    nock('https://proxy.internal/cdn.example.com/x')
      .get('/')
      .reply(200, { message: 'ok' });
    const Service = class extends TestService {
      public baseURL = 'https://proxy.internal/cdn.example.com/x';
    };
    await Service.fetch();
    const attrs = exporter.getFinishedSpans()[0].attributes;
    expect(attrs).not.toHaveProperty('outgoing.response.data');
    expect(attrs).toHaveProperty('outgoing.request.url');
  });
});
