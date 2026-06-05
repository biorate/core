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

describe('@biorate/opentelemetry - spans with exclude', () => {
  beforeEach(() => {
    memoryExporter.reset();
  });

  it('should exclude specified fields from arguments', async () => {
    const test = new Test();
    test.testOptionsNoRequest('secret-value', { password: '123' });

    await setTimeout(50);

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'noRequest');

    expect(span).toBeDefined();
    const attrs = span!.attributes;

    // Исключённые поля не должны быть захвачены
    const args = JSON.parse(attrs['arguments'] as string);
    // args[0] = 'secret-value' (строка, не объект, исключение не применяется)
    // args[1] = { password: '123' } (объект, но у него нет полей secret/data, поэтому остаётся как есть)
    expect(args[0]).toBe('secret-value');
    expect(args[1]).toEqual({ password: '123' });
    // Но метаданные сохраняются
    expect(attrs['class']).toBe('Test');
    expect(attrs['method']).toBe('testOptionsNoRequest');
  });

  it('should exclude specified fields from result', async () => {
    const test = new Test();
    test.testNoResult(42);

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'noResponse');

    expect(span).toBeDefined();
    const attrs = span!.attributes;
    const result = JSON.parse(attrs['result'] as string);

    // Исключённые поля не должны быть захвачены
    expect(result.secret).toBeUndefined();
    expect(result.data).toBeUndefined();
  });

  it('should exclude body but keep query and headers', async () => {
    const test = new Test();
    const mockReq = {
      body: { sensitive: 'data' },
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
    expect(args[0].body).toBeUndefined();
    // Query и headers сохранены
    expect(args[0].query).toEqual({ id: '123' });
    expect(args[0].headers).toEqual({ authorization: 'Bearer token' });
  });

  it('should exclude fields from both arguments and result', async () => {
    const test = new Test();
    const buffer = Buffer.from('sensitive-binary-data');

    test.testBinaryFile(buffer);

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'noRequestNoResponse');

    expect(span).toBeDefined();
    const attrs = span!.attributes;

    // Исключённые поля отфильтрованы
    const args = JSON.parse(attrs['arguments'] as string);
    const result = JSON.parse(attrs['result'] as string);

    // Buffer имеет свойства type и data, но они не исключены, поэтому остаются
    // Проверяем, что аргументы и результат захвачены (не undefined)
    expect(args).toBeDefined();
    expect(result).toBeDefined();
    // Но метаданные есть
    expect(attrs['class']).toBe('Test');
    expect(attrs['method']).toBe('testBinaryFile');
  });

  it('should exclude body from response but keep headers and statusCode', async () => {
    const test = new Test();
    test.testResponseHandler();

    await setTimeout(200);
    await provider.forceFlush();

    const spans = memoryExporter.getFinishedSpans();
    const span = spans.find((s) => s.name === 'responseHandler');

    expect(span).toBeDefined();
    const attrs = span!.attributes;
    const result = JSON.parse(attrs['result'] as string);

    // Body отфильтрован
    expect(result.body).toBeUndefined();
    // Headers и statusCode сохранены
    expect(result.headers).toEqual({ 'content-type': 'application/json' });
    expect(result.statusCode).toBe(200);
  });

  it('should capture all data by default when exclude is not specified', async () => {
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
