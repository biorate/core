import { describe, it, expect, afterEach } from 'vitest';
import { exporter, TestExclude } from './__mocks__/exclude';

describe('@biorate/opentelemetry / exclude', () => {
  afterEach(() => {
    exporter.reset();
  });

  it('should not filter when no exclude is specified', () => {
    const test = new TestExclude();
    test.noExclude(1, 2);

    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);

    const args = JSON.parse(spans[0].attributes.arguments as string);
    expect(args).toEqual([1, 2]);

    const result = JSON.parse(spans[0].attributes.result as string);
    expect(result).toEqual({ result: 'data', password: 'supersecret' });
  });

  it('should exclude entire arguments and result attributes', () => {
    const test = new TestExclude();
    test.excludeAll({ foo: 'bar' });

    const spans = exporter.getFinishedSpans();
    expect(spans[0].attributes.arguments).toBeUndefined();
    expect(spans[0].attributes.result).toBeUndefined();
  });

  it('should exclude specific argument field by path', () => {
    const test = new TestExclude();
    test.excludeArgField({ password: 'secret123', name: 'John' });

    const spans = exporter.getFinishedSpans();
    const args = JSON.parse(spans[0].attributes.arguments as string);

    expect(args).toHaveLength(1);
    expect(args[0].password).toBeUndefined();
    expect(args[0].name).toBe('John');
  });

  it('should exclude specific result fields by path', () => {
    const test = new TestExclude();
    test.excludeResultFields(null);

    const spans = exporter.getFinishedSpans();
    const result = JSON.parse(spans[0].attributes.result as string);

    expect(result.token).toBeUndefined();
    expect(result.nested.secret).toBeUndefined();
    expect(result.nested.visible).toBe('ok');
    expect(result.normal).toBe('hello');
  });

  it('should exclude fields matching single-level wildcard (*)', () => {
    const test = new TestExclude();
    test.excludeWildcard({ name: 'Alice', creditCard: '4111-1111-1111-1111' });

    const spans = exporter.getFinishedSpans();
    const args = JSON.parse(spans[0].attributes.arguments as string);

    expect(args[0].creditCard).toBeUndefined();
    expect(args[0].name).toBe('Alice');
  });

  it('should exclude fields matching multi-level wildcard (**)', () => {
    const test = new TestExclude();
    test.excludeGlobstar({ deep: { creditCard: '4111-1111-1111-1111' } });

    const spans = exporter.getFinishedSpans();
    const args = JSON.parse(spans[0].attributes.arguments as string);

    expect(args[0].deep.creditCard).toBeUndefined();
  });

  it('should exclude result fields in async methods', async () => {
    const test = new TestExclude();
    const result = await test.asyncExclude('hello');

    expect(result).toEqual({ token: 'async-token', data: 'public' });

    const spans = exporter.getFinishedSpans();
    const resultAttr = JSON.parse(spans[0].attributes.result as string);

    expect(resultAttr.token).toBeUndefined();
    expect(resultAttr.data).toBe('public');
  });

  it('should return the original value from the method despite exclude', () => {
    const test = new TestExclude();
    const result = test.excludeResultFields(null);

    expect(result).toEqual({
      token: 'abc123',
      nested: { secret: 'classified', visible: 'ok' },
      normal: 'hello',
    });
  });
});
