import { MemoryPgClient } from '../pg/memory-client';
import { PgUnsupportedInMemoryError } from '../pg/errors';
import { MssqlUnsupportedInMemoryError } from './errors';

export interface IMemoryMssqlQueryResult {
  recordset: Record<string, unknown>[];
  recordsets: Record<string, unknown>[][];
  rowsAffected: number[];
  output: Record<string, unknown>;
}

/** @description In-memory MSSQL client reusing the PG memory store with mssql-shaped responses. */
export class MemoryMssqlClient {
  readonly #pg = new MemoryPgClient();

  public async connect() {
    return undefined;
  }

  public async close() {
    await this.#pg.end();
  }

  public async query(sql: string, values?: unknown[]): Promise<IMemoryMssqlQueryResult> {
    try {
      const result = await this.#pg.query(sql, values);
      return {
        recordset: result.rows,
        recordsets: [result.rows],
        rowsAffected: [result.rowCount],
        output: {},
      };
    } catch (e: unknown) {
      if (e instanceof PgUnsupportedInMemoryError) {
        throw new MssqlUnsupportedInMemoryError(sql);
      }
      throw e;
    }
  }
}
