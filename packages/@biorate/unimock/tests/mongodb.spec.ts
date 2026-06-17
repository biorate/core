import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown } from './__mocks__/mongodb';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/mongodb', () => {
  it('mongodb connector', async () => {
    const conn = root.connector.current!;
    const col = await (conn as any).collection('unimock_test');
    await col.updateOne(
      { _id: 'unimock:key' },
      { $set: { value: 'unimock-value' } },
      { upsert: true },
    );
    const doc = await col.findOne({ _id: 'unimock:key' });
    expect(doc?.value).toBe('unimock-value');
  });
});
