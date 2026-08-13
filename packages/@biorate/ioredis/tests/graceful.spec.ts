import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gracefulDegradation } from '../src/graceful';

describe('Graceful Degradation', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('get() returns null when original throws', async () => {
    const mockRedis = {
      get: vi.fn().mockRejectedValue(new Error('Connection closed')),
    };
    gracefulDegradation(<any>mockRedis);
    const result = await mockRedis.get('key');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('[Redis] get failed: Connection closed');
  });

  it('set() returns null when original throws', async () => {
    const mockRedis = {
      set: vi.fn().mockRejectedValue(new Error('Connection closed')),
    };
    gracefulDegradation(<any>mockRedis);
    const result = await mockRedis.set('key', 'value');
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('[Redis] set failed: Connection closed');
  });

  it('returns original result when no error', async () => {
    const mockRedis = {
      get: vi.fn().mockResolvedValue('cached'),
    };
    gracefulDegradation(<any>mockRedis);
    const result = await mockRedis.get('key');
    expect(result).toBe('cached');
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
