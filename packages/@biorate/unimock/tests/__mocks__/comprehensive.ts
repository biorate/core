export class OtherService {
  doSomething(): string {
    return 'other-done';
  }
}

export class ComprehensiveService {
  // --- Return types ---
  retString(): string {
    return 'hello';
  }
  retNumber(): number {
    return 42;
  }
  retBoolean(): boolean {
    return true;
  }
  retNull(): null {
    return null;
  }
  retUndefined(): undefined {
    return undefined;
  }
  retBigInt(): bigint {
    return 123n;
  }
  retDate(): Date {
    return new Date('2024-06-17');
  }
  retRegExp(): RegExp {
    return /test/gi;
  }
  retBuffer(): Buffer {
    return Buffer.from('hello');
  }
  retError(): Error {
    return new Error('test-error');
  }
  retPlainObject(): { a: number; b: { c: number } } {
    return { a: 1, b: { c: 2 } };
  }
  retArray(): number[] {
    return [1, 2, 3];
  }
  retClassInstance(): OtherService {
    return new OtherService();
  }

  // --- Connection (has methods) ---
  retConnection(): { query: (sql: string) => string } {
    return { query: (sql: string) => `result: ${sql}` };
  }
  get connection(): { query: (sql: string) => string } {
    return { query: (sql: string) => `getter: ${sql}` };
  }

  // --- Async ---
  async asyncRetString(): Promise<string> {
    return 'async-hello';
  }
  async asyncRetConnection(): Promise<{ query: (sql: string) => string }> {
    return { query: (sql: string) => `async-result: ${sql}` };
  }

  // --- Throws ---
  throwSync(): never {
    throw new Error('sync-error');
  }
  async throwAsync(): Promise<never> {
    throw new Error('async-error');
  }

  // --- Callbacks ---
  withSyncCallback(cb: (msg: string) => void): string {
    cb('sync-called');
    return 'sync-cb-done';
  }
  async withAsyncCallback(cb: (msg: string) => Promise<void>): Promise<string> {
    await cb('async-called');
    return 'async-cb-done';
  }

  // --- Args differentiation ---
  sum(a: number, b: number): number {
    return a + b;
  }

  // --- No args ---
  noArgs(): string {
    return 'no-args';
  }

  // --- Getters ---
  get plainGetter(): string {
    return 'plain-getter';
  }

  // --- Static ---
  static count(): number {
    return 42;
  }
  static sync(): string {
    return 'synced';
  }
}
