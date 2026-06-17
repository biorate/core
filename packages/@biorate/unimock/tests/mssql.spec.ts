import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown } from './__mocks__/mssql';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/mssql', () => {
  it('mssql connector', async () => {
    const result = await root.connector.current!.query('SELECT 1 AS result');
    expect((result.recordsets as any)[0][0].result).toBe(1);
  });
});
