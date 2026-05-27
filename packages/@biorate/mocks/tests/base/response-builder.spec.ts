import { describe, it, expect, beforeEach } from 'vitest';
import { ResponseBuilder } from '../../src/base/response-builder';

describe('ResponseBuilder', () => {
  let builder: ResponseBuilder<string>;

  beforeEach(() => {
    builder = new ResponseBuilder<string>();
  });

  it('should build simple response', async () => {
    builder.thenReturn('hello');

    const result = await builder.build([]);
    expect(result).toBe('hello');
  });

  it('should build response with function', async () => {
    builder.thenReturn(() => 'dynamic');

    const result = await builder.build([]);
    expect(result).toBe('dynamic');
  });

  it('should build response with async function', async () => {
    builder.thenReturn(async () => 'async');

    const result = await builder.build([]);
    expect(result).toBe('async');
  });

  it('should throw error', async () => {
    const error = new Error('test error');
    builder.thenThrow(error);

    await expect(builder.build([])).rejects.toThrow('test error');
  });

  it('should resolve after delay', async () => {
    const start = Date.now();
    builder.thenResolveAfter(100, 'delayed');

    const result = await builder.build([]);
    const elapsed = Date.now() - start;

    expect(result).toBe('delayed');
    expect(elapsed).toBeGreaterThanOrEqual(95);
  });

  it('should build sequence', async () => {
    builder.thenSequence(['first', 'second', 'third']);

    expect(await builder.build([])).toBe('first');
    expect(await builder.build([])).toBe('second');
    expect(await builder.build([])).toBe('third');
    expect(await builder.build([])).toBe('first');
  });

  it('should match condition', async () => {
    builder
      .when(([arg]) => arg === 'match')
      .thenReturn('matched')
      .when(([arg]) => arg === 'other')
      .thenReturn('other');

    expect(await builder.build(['match'])).toBe('matched');
    expect(await builder.build(['other'])).toBe('other');
  });

  it('should use first matching condition', async () => {
    builder
      .when(([arg]) => typeof arg === 'string')
      .thenReturn('string')
      .when(([arg]) => arg === 'test')
      .thenReturn('specific');

    expect(await builder.build(['test'])).toBe('string');
  });

  it('should throw when no match', async () => {
    builder.when(([arg]) => arg === 'match').thenReturn('matched');

    await expect(builder.build(['no-match'])).rejects.toThrow(
      'No matching response configuration found'
    );
  });

  it('should clear configurations', async () => {
    builder.thenReturn('hello');
    builder.clear();

    await expect(builder.build([])).rejects.toThrow(
      'No matching response configuration found'
    );
  });

  it('should call real implementation', async () => {
    builder.thenCallRealImplementation((...args) => `real: ${args.join(',')}`);

    const result = await builder.build(['a', 'b']);
    expect(result).toBe('real: a,b');
  });

  it('should support complex conditions', async () => {
    builder
      .when(([query]) => query.includes('SELECT'))
      .thenReturn('query-result')
      .when(([query]) => query.includes('INSERT'))
      .thenReturn('insert-result');

    expect(await builder.build(['SELECT * FROM table'])).toBe('query-result');
    expect(await builder.build(['INSERT INTO table'])).toBe('insert-result');
  });
});
