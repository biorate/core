import { ClickhouseUnsupportedInMemoryError } from './errors';

export interface IMemoryClickhouseQueryParams {
  query: string;
  format?: string;
}

export interface IMemoryClickhouseCursor<T = unknown> {
  json(): Promise<{ data: T[] }>;
}

/** @description In-memory ClickHouse client with a minimal query surface for component tests. */
export class MemoryClickhouseClient {
  public async query(params: IMemoryClickhouseQueryParams): Promise<IMemoryClickhouseCursor> {
    const normalized = params.query.trim().replace(/\s+/g, ' ');

    if (/^SELECT 1 AS result;?$/i.test(normalized)) {
      return {
        json: async () => ({ data: [{ result: 1 }] }),
      };
    }

    throw new ClickhouseUnsupportedInMemoryError(params.query);
  }
}
