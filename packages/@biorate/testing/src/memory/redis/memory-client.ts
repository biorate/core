import { RedisUnsupportedInMemoryError } from './errors';

/** @description In-memory Redis client with a minimal command set for component tests. */
export class MemoryRedisClient {
  readonly #data = new Map<string, string>();

  public async connect() {
    return undefined;
  }

  public async disconnect() {
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

  public async hSet(key: string, field: string, value: string) {
    const hashKey = `${key}:${field}`;
    this.#data.set(hashKey, value);
    return 1;
  }

  public async hGet(key: string, field: string) {
    return this.#data.get(`${key}:${field}`) ?? null;
  }

  public unsupported(command: string): never {
    throw new RedisUnsupportedInMemoryError(command);
  }
}
