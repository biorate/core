import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Unimock } from '@biorate/unimock';
import { root } from './__mocks__';

describe('@biorate/clickhouse', function () {
  beforeAll(async () => await root.$run());

  afterAll(() => {
    Unimock.flush();
  });

  it('query', async () => {
    const cursor = await root.connector
      .get()
      .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toBe(1);
  });
});
