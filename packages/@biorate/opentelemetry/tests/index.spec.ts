import { setTimeout } from 'timers/promises';
import { Test } from './__mocks__';
import { memoryExporter, provider } from './setup';

describe('@biorate/opentelemetry', () => {
  beforeEach(() => {
    memoryExporter.reset();
  });

  it('span', async () => {
    const test = new Test();
    test.test1(1, 2);
    test.test2(3, 4);
    try {
      test.test3(5, 6);
    } catch {}
  });

  it('async span', async () => {
    const test = new Test();
    await test.test5(1);
  });

  it('masking', async () => {
    const test = new Test();
    test.test4('in@mail.com');
  });
});

describe('@biorate/opentelemetry - spans with options', () => {
  beforeEach(() => {
    memoryExporter.reset();
  });

    it('should ignore arguments when captureRequest: false', async () => {
      const test = new Test();
      test.testOptionsNoRequest('secret-value', { password: '123' });

      await setTimeout(50);

      const spans = memoryExporter.getFinishedSpans();
      const span = spans.find((s) => s.name === 'noRequest');

      expect(span).toBeDefined();
      const attrs = span!.attributes;

      // Аргументы не должны быть захвачены (captureRequest: false)
      expect(attrs['arguments']).toBeUndefined();
      // Но метаданные сохраняются
      expect(attrs['class']).toBe('Test');
      expect(attrs['method']).toBe('testOptionsNoRequest');
    });

    it('should ignore result when captureResponse: false', async () => {
      const test = new Test();
      test.testNoResult(42);

      await setTimeout(200);
      await provider.forceFlush();

      const spans = memoryExporter.getFinishedSpans();
      const span = spans.find((s) => s.name === 'noResponse');

      expect(span).toBeDefined();
      const attrs = span!.attributes;

      // Результат не должен быть захвачен (captureResponse: false)
      expect(attrs['result']).toBeUndefined();
    });

    it('should capture only query and headers, ignoring body', async () => {
      const test = new Test();
      const mockReq = {
        query: { id: '123' },
        headers: { authorization: 'Bearer token' },
      };

      test.testHttpHandler(mockReq);

      await setTimeout(200);
      await provider.forceFlush();

      const spans = memoryExporter.getFinishedSpans();
      const span = spans.find((s) => s.name === 'httpHandler');

      expect(span).toBeDefined();
      const attrs = span!.attributes;

      // Body должен быть отфильтрован
      const args = JSON.parse(attrs['arguments'] as string);
      expect(args.body).toBeUndefined();
      // Query и headers сохранены
      expect(args.query).toEqual({ id: '123' });
      expect(args.headers).toEqual({ authorization: 'Bearer token' });
    });

  it('should ignore both arguments and result for binary data', async () => {
    const test = new Test();
    const buffer = Buffer.from('sensitive-binary-data');

    test.testBinaryFile(buffer);

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'noRequestNoResponse');

    expect(span).toBeDefined();
    const attrs = span!.attributes;

    // Ничего из данных не захвачено
    expect(attrs['arguments']).toBeUndefined();
    expect(attrs['result']).toBeUndefined();
    // Но метаданные есть
    expect(attrs['class']).toBe('Test');
    expect(attrs['method']).toBe('testBinaryFile');
  });

  it('should capture statusCode and headers but not response body', async () => {
    const test = new Test();
    test.testResponseHandler();

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'responseHandler');

    expect(span).toBeDefined();
    const attrs = span!.attributes;
    const result = JSON.parse(attrs['result'] as string);

    // Body отфильтрован (не передаётся в ответе)
    expect(result.body).toBeUndefined();
    // Headers и statusCode сохранены
    expect(result.headers).toEqual({ 'content-type': 'application/json' });
    expect(result.statusCode).toBe(200);
  });

  it('detailed flags override general flags', async () => {
    const test = new Test();
    const mockReq = {
      query: { id: '123' },
      headers: { authorization: 'Bearer token' },
    };

    test.testHttpHandler(mockReq);

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'httpHandler');

    expect(span).toBeDefined();
    const attrs = span!.attributes;

    const args = JSON.parse(attrs['arguments'] as string);

    // captureBody: false отменяет захват body
    expect(args.body).toBeUndefined();
    // Но query и headers захвачены
    expect(args.query).toEqual({ id: '123' });
    expect(args.headers).toEqual({ authorization: 'Bearer token' });
  });

  it('should capture all data by default (backward compatibility)', async () => {
    const test = new Test();
    test.test1(123, 456);

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'test1');

    expect(span).toBeDefined();

    // По умолчанию всё захватывается
    expect(span!.attributes['arguments']).toBeDefined();
    expect(span!.attributes['result']).toBeDefined();
  });

  afterAll(async () => await setTimeout(5000));
});
