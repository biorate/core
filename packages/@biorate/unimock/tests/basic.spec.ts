import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Mockable, Unimock } from '../src';

class TestService {
  public value = 42;
  
  public getValue(): number {
    return this.value;
  }
  
  public async getAsyncValue(): Promise<number> {
    return this.value;
  }
  
  public multiply(x: number, y: number): number {
    return x * y;
  }
  
  public async asyncMultiply(x: number, y: number): Promise<number> {
    return x * y;
  }
}

@Mockable('test-snapshot')
class MockableTestService extends TestService {}

describe('Unimock basic functionality', () => {
  let service: MockableTestService;

  beforeAll(() => {
    process.env.UNIMOCK = 'record';
    service = new MockableTestService();
    Unimock.getHandler(service);
  });

  afterAll(() => {
    Unimock.flush();
    process.env.UNIMOCK = '';
  });

  it('should be mockable', () => {
    expect(Unimock.isMockable(service)).toBe(true);
  });

  it('should record sync method calls', () => {
    const result = service.getValue();
    expect(result).toBe(42);
  });

  it('should record async method calls', async () => {
    const result = await service.getAsyncValue();
    expect(result).toBe(42);
  });

  it('should record method with arguments', () => {
    const result = service.multiply(3, 4);
    expect(result).toBe(12);
  });

  it('should record async method with arguments', async () => {
    const result = await service.asyncMultiply(5, 6);
    expect(result).toBe(30);
  });

  it('should have correct mode', () => {
    const mode = Unimock.getMode(service);
    expect(mode).toBe('record');
  });
});
