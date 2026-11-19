import { afterEach, describe, expect, it } from 'vitest';
import { deserialize, registerClass, serialize, unregisterClass } from '../../src';
import type { SerializedValue } from '../../src';

/**
 * Error round-trip: own fields, class registry and typed arrays.
 *
 * Registered/unregistered class behavior is process-global (module-level
 * registry), so the AxiosError-like class is registered here and re-registered
 * per test that relies on it; `afterEach` removes it to keep other suites
 * (legacy fallback) unaffected.
 */
class AxiosError extends Error {
  response?: { status: number; data: Record<string, unknown> };
  config?: Record<string, unknown>;
  code?: string;
  constructor(
    message: string,
    fields: {
      response?: { status: number; data: Record<string, unknown> };
      config?: Record<string, unknown>;
      code?: string;
    } = {},
  ) {
    super(message);
    this.name = 'AxiosError';
    Object.assign(this, fields);
  }
}

afterEach(() => {
  // The registry is process-global (module-level map) — remove the test class
  // registration so legacy-fallback expectations stay isolated per test.
  unregisterClass('AxiosError');
});

const roundtrip = (value: unknown): unknown =>
  deserialize(serialize(value) as SerializedValue);

describe('error round-trip', () => {
  it('registered class: instanceof and own fields restored', () => {
    registerClass('AxiosError', AxiosError);
    const err = new AxiosError('boom', {
      response: { status: 401, data: { foo: 'bar' } },
      config: { url: '/api/x' },
      code: 'ERR_BAD_REQUEST',
    });
    const restored = roundtrip(err) as AxiosError;
    expect(restored).toBeInstanceOf(AxiosError);
    expect(restored.message).toBe('boom');
    expect(restored.response?.status).toBe(401);
    expect(restored.response?.data.foo).toBe('bar');
    expect(restored.config).toEqual({ url: '/api/x' });
    expect(restored.code).toBe('ERR_BAD_REQUEST');
  });

  it('unregistered name falls back to generic Error with name/message/stack', () => {
    const err = new AxiosError('boom', { code: 'X' });
    const restored = roundtrip(err) as AxiosError;
    expect(restored).toBeInstanceOf(Error);
    expect(restored).not.toBeInstanceOf(AxiosError);
    expect(restored.name).toBe('AxiosError');
    expect(restored.message).toBe('boom');
    expect(typeof restored.stack).toBe('string');
    // Own fields still travel (they are part of the payload), only the class
    // identity is lost without registration.
    expect((restored as unknown as Record<string, unknown>).code).toBe('X');
  });

  it('generic Error without extra fields round-trips unchanged', () => {
    const err = new TypeError('nope');
    const restored = roundtrip(err) as TypeError;
    expect(restored).toBeInstanceOf(TypeError);
    expect(restored.name).toBe('TypeError');
    expect(restored.message).toBe('nope');
  });

  it('legacy snapshot payload {n,m,s} without p deserializes as before', () => {
    const legacy: SerializedValue = {
      t: 'error',
      v: { n: 'AxiosError', m: 'boom', s: 'Error: boom\n    at x' },
    };
    const restored = deserialize(legacy) as Record<string, unknown>;
    expect(restored).toBeInstanceOf(Error);
    expect(restored.name).toBe('AxiosError');
    expect(restored.message).toBe('boom');
    expect(restored.stack).toBe('Error: boom\n    at x');
  });

  it('cyclic error.request with UNIMOCK_STRIP_REQUEST=1 serializes without failure', () => {
    process.env.UNIMOCK_STRIP_REQUEST = '1';
    try {
      const err = new AxiosError('boom');
      const request = { method: 'GET', path: '/api/x' };
      // Axios-style cycle: request <-> response <-> request
      (err as unknown as Record<string, unknown>).request = request;
      (err as unknown as { response: unknown }).response = { status: 401, request };
      (request as unknown as Record<string, unknown>).response = (
        err as unknown as { response: unknown }
      ).response;
      const restored = roundtrip(err) as Record<string, unknown>;
      expect(restored.message).toBe('boom');
      expect(restored.request).toBeUndefined(); // stripped by the flag
      expect((restored.response as { status: number }).status).toBe(401);
    } finally {
      delete process.env.UNIMOCK_STRIP_REQUEST;
    }
  });
});

describe('typed array round-trip', () => {
  it('Uint8Array survives with identical bytes', () => {
    const bytes = new Uint8Array([1, 2, 3, 250, 251, 252, 0, 255]);
    const restored = roundtrip(bytes);
    expect(restored).toBeInstanceOf(Uint8Array);
    expect(Array.from(restored as Uint8Array)).toEqual(Array.from(bytes));
  });

  it('Buffer still round-trips as Buffer', () => {
    const buf = Buffer.from('pdf-bytes-here');
    const restored = roundtrip(buf);
    expect(Buffer.isBuffer(restored)).toBe(true);
    expect((restored as Buffer).toString()).toBe('pdf-bytes-here');
  });

  it('empty Uint8Array round-trips', () => {
    const restored = roundtrip(new Uint8Array(0));
    expect(restored).toBeInstanceOf(Uint8Array);
    expect((restored as Uint8Array).length).toBe(0);
  });
});
