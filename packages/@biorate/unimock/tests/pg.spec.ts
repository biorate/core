import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { PgConnector, setup, teardown } from './__mocks__/pg';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/pg', () => {
  it('pg connector', async () => {
    const result = await root.connector.current!.query('SELECT 1 AS result');
    expect(result.rows[0].result).toBe(1);
  });
});
