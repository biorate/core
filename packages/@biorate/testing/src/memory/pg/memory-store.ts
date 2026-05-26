export type PgRow = Record<string, unknown>;

/** @description In-memory table storage for MemoryPgClient. */
export class MemoryPgStore {
  readonly #tables = new Map<string, PgRow[]>();

  public reset() {
    this.#tables.clear();
  }

  public dropTable(name: string) {
    this.#tables.delete(name.toLowerCase());
  }

  public createTable(name: string, columns: string[]) {
    this.#tables.set(name.toLowerCase(), []);
    return columns;
  }

  public insert(table: string, rows: PgRow[]) {
    const list = this.#tables.get(table.toLowerCase()) ?? [];
    list.push(...rows);
    this.#tables.set(table.toLowerCase(), list);
  }

  public selectAll(table: string) {
    return [...(this.#tables.get(table.toLowerCase()) ?? [])];
  }

  public hasTable(table: string) {
    return this.#tables.has(table.toLowerCase());
  }
}
