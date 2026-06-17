import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown, startServers, stopServers } from './__mocks__/proxy';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(() => {
  startServers();
});

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  stopServers();
  teardown();
});

describe('@biorate/proxy', () => {
  it('proxy connector', async () => {
    const conn = root.connector.get();
    expect(conn).toBeDefined();
  });
});
