import { PgUnsupportedInMemoryError } from './errors';
import { MemoryPgStore, PgRow } from './memory-store';

export interface IMemoryPgQueryResult {
  rows: PgRow[];
  rowCount: number;
}

/** @description In-memory PostgreSQL client compatible with `pg` Client surface used in tests. */
export class MemoryPgClient {
  public readonly store = new MemoryPgStore();

  public async connect() {
    return undefined;
  }

  public async end() {
    this.store.reset();
  }

  public async query(sql: string, values?: unknown[]): Promise<IMemoryPgQueryResult> {
    const normalized = sql.trim().replace(/\s+/g, ' ');

    if (/^DROP TABLE IF EXISTS\s+(\w+)/i.test(normalized)) {
      const table = normalized.match(/^DROP TABLE IF EXISTS\s+(\w+)/i)![1];
      this.store.dropTable(table);
      return { rows: [], rowCount: 0 };
    }

    if (/^CREATE TABLE\s+(\w+)/i.test(normalized)) {
      const table = normalized.match(/^CREATE TABLE\s+(\w+)/i)![1];
      this.store.createTable(table, []);
      return { rows: [], rowCount: 0 };
    }

    if (/^INSERT INTO\s+(\w+)/i.test(normalized)) {
      const table = normalized.match(/^INSERT INTO\s+(\w+)/i)![1];
      const rows = this.#parseInsertRows(normalized, values);
      this.store.insert(table, rows);
      return { rows: [], rowCount: rows.length };
    }

    if (/^SELECT \* FROM\s+(\w+)/i.test(normalized)) {
      const table = normalized.match(/^SELECT \* FROM\s+(\w+)/i)![1];
      const rows = this.store.selectAll(table);
      return { rows, rowCount: rows.length };
    }

    throw new PgUnsupportedInMemoryError(normalized);
  }

  #parseInsertRows(sql: string, values?: unknown[]): PgRow[] {
    const multi = sql.match(/VALUES\s+(.+);?$/i);
    if (!multi) return [];

    const valueGroups = multi[1].split(/\),\s*\(/).map((chunk) =>
      chunk.replace(/^\(|\)$/g, '').split(',').map((part) => part.trim()),
    );

    if (values?.length) {
      return valueGroups.map((group, index) => ({
        count: values[index * group.length],
        text: values[index * group.length + 1],
      }));
    }

    return valueGroups.map((group) => ({
      count: Number(group[0]),
      text: group[1]
        .replace(/^'|'$/g, '')
        .replace(/'\);?$/g, '')
        .replace(/\);?$/g, ''),
    }));
  }
}
