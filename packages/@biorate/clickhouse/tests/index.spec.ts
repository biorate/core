import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureUnimock, Unimock } from '@biorate/unimock';
import { getTestRoot } from './__mocks__';
import type { Root } from './__mocks__';

let queryCalls = 0;

vi.mock('@clickhouse/client', () => {
  class Cursor {
    readonly #query: string;
    public constructor(query: string) {
      this.#query = query;
    }
    public async json<T>() {
      if (this.#query === 'SELECT 1') return { data: [] as unknown as T[] };
      return { data: [{ result: 1 }] as unknown as T[] };
    }
  }

  return {
    createClient() {
      return {
        async query({ query }: { query: string }) {
          queryCalls += 1;
          return new Cursor(query);
        },
      };
    },
  };
});

describe('@biorate/clickhouse', function () {
  let root: Root;
  const snapshotDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unimock-clickhouse-'));

  beforeAll(async () => {
    configureUnimock({ mode: 'auto', snapshotDir });
    root = getTestRoot();
    await root.$run();
  });

  beforeEach((ctx) => {
    Unimock.setTestName(ctx.task.name);
  });

  afterAll(() => {
    Unimock.flush();
  });

  it('query records on miss and replays afterwards', async () => {
    const cursor = await root.connector
      .get()
      .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
    const { data } = await cursor.json<{ result: number }>();
    expect(data[0].result).toBe(1);

    Unimock.flush();
    expect(queryCalls).toBeGreaterThan(0);

    queryCalls = 0;
    configureUnimock({ mode: 'replay', snapshotDir });
    Unimock.setTestName('query records on miss and replays afterwards');

    const cursor2 = await root.connector
      .get()
      .query({ query: 'SELECT 1 AS result;', format: 'JSON' });
    const { data: data2 } = await cursor2.json<{ result: number }>();
    expect(data2[0].result).toBe(1);
    expect(queryCalls).toBe(0);
  });
});
