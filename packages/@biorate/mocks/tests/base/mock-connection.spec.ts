import { describe, it, expect, beforeEach } from 'vitest';
import { MockConnection } from '../../src/base/mock-connection';

class TestConnection extends MockConnection {
  testMethod(arg1: string, arg2: number): string {
    this.trackCall('testMethod', arg1, arg2);
    return `${arg1}-${arg2}`;
  }

  async asyncMethod(): Promise<string> {
    await this.applyDelay();
    this.trackCall('asyncMethod');
    return 'async';
  }
}

describe('MockConnection', () => {
  let connection: TestConnection;

  beforeEach(() => {
    connection = new TestConnection();
  });

  it('should track method calls', () => {
    connection.testMethod('hello', 42);

    expect(connection.wasCalled('testMethod')).toBe(true);
    expect(connection.getCallCount('testMethod')).toBe(1);
  });

  it('should track multiple calls', () => {
    connection.testMethod('a', 1);
    connection.testMethod('b', 2);
    connection.testMethod('c', 3);

    expect(connection.getCallCount('testMethod')).toBe(3);
  });

  it('should get last call', () => {
    connection.testMethod('first', 1);
    connection.testMethod('last', 2);

    const lastCall = connection.getLastCall('testMethod');
    expect(lastCall?.args).toEqual(['last', 2]);
  });

  it('should get all calls', () => {
    connection.testMethod('a', 1);
    connection.testMethod('b', 2);

    const calls = connection.getAllCalls('testMethod');
    expect(calls).toHaveLength(2);
  });

  it('should clear calls', () => {
    connection.testMethod('hello', 42);
    connection.clearCalls();

    expect(connection.wasCalled('testMethod')).toBe(false);
    expect(connection.getCallCount('testMethod')).toBe(0);
  });

  it('should reset connection', () => {
    connection.testMethod('hello', 42);
    connection.reset();

    expect(connection.getCallCount('testMethod')).toBe(0);
  });

  it('should apply delay', async () => {
    const start = Date.now();
    connection.withDelay(100);
    await connection.asyncMethod();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(95);
  });

  it('should get methods', () => {
    connection.testMethod('hello', 42);
    const methods = connection.getMethods();

    expect(methods).toHaveProperty('testMethod');
  });

  it('should check if method was called with args', () => {
    connection.testMethod('hello', 42);

    expect(connection.wasCalled('testMethod', ['hello', 42])).toBe(true);
    expect(connection.wasCalled('testMethod', ['hello', 99])).toBe(false);
  });

  it('should expect method', () => {
    connection.testMethod('hello', 42);

    const mock = connection.expectMethod('testMethod');
    expect(mock).toHaveBeenCalled();
  });

  it('should throw on expectMethod for untracked method', () => {
    expect(() => connection.expectMethod('nonExistent')).toThrow(
      'Method "nonExistent" was not tracked'
    );
  });
});
