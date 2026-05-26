/** @description In-memory IORedis client with a minimal command set for component tests. */
export class MemoryIORedisClient {
  readonly #data = new Map<string, string>();

  public async connect() {
    return undefined;
  }

  public async quit() {
    this.#data.clear();
  }

  public async set(key: string, value: string) {
    this.#data.set(key, value);
    return 'OK';
  }

  public async get(key: string) {
    return this.#data.get(key) ?? null;
  }

  public async del(key: string) {
    const existed = this.#data.delete(key);
    return existed ? 1 : 0;
  }
}
