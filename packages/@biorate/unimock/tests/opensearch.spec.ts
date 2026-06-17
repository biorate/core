import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown } from './__mocks__/opensearch';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/opensearch', () => {
  it('opensearch connector', async () => {
    try {
      await root.connector.deleteIndex('unimock_test_opensearch');
    } catch {
      // index may not exist
    }

    const indexRes = await root.connector.createIndex('unimock_test_opensearch');
    expect(indexRes.acknowledged).toBe(true);

    const doc = { title: 'test', value: 42 };
    const createRes = await root.connector.indexDoc('unimock_test_opensearch', doc);
    expect(createRes.result).toBe('created');

    const getRes = await root.connector.getDoc('unimock_test_opensearch', createRes._id);
    expect(getRes.found).toBe(true);
    expect(getRes._source.title).toBe('test');
    expect(getRes._source.value).toBe(42);
  });
});
