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

@Mockable('test-replay-snapshot')
class MockableTestService extends TestService {}

describe('Unimock replay functionality', () => {
  let recordService: MockableTestService;
  let replayService: MockableTestService;

  beforeAll(() => {
    process.env.UNIMOCK = 'record';
    recordService = new MockableTestService();
    recordService.getValue();
    recordService.multiply(3, 4);
    
    Unimock.flush();
    
    process.env.UNIMOCK = 'replay';
    replayService = new MockableTestService();
  });

  afterAll(() => {
    Unimock.flush();
    process.env.UNIMOCK = '';
  });

  it('should replay sync method calls', () => {
    const result = replayService.getValue();
    expect(result).toBe(42);
  });

  it('should replay method with arguments', () => {
    const result = replayService.multiply(3, 4);
    expect(result).toBe(12);
  });

  it('should have replay mode', () => {
    const mode = Unimock.getMode(replayService);
    expect(mode).toBe('replay');
  });
});
