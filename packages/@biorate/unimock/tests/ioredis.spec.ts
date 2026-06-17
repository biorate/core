import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown } from './__mocks__/ioredis';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/ioredis', () => {
  it('ioredis connector', async () => {
    const conn = root.connector.current!;
    await conn.set('unimock:key', 'unimock-value');
    const value = await conn.get('unimock:key');
    expect(value).toBe('unimock-value');
  });
});
