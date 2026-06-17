import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown } from './__mocks__/clickhouse';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/clickhouse', () => {
  it('clickhouse connector', async () => {
    const cursor = await root.connector.get().query({
      query: 'SELECT 1 AS result;',
      format: 'JSON',
    });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toBe(1);
  });
});
