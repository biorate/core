import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { setup, teardown, startServers, stopServers } from './__mocks__/proxy-prometheus';

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

describe('@biorate/proxy-prometheus', () => {
  it('proxy-prometheus connector', async () => {
    const conn = root.connector.get();
    expect(conn).toBeDefined();
  });
});
