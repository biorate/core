type VaultPayload = { data?: Record<string, unknown> };

/** @description In-memory Vault KV store for component tests. */
export class MemoryVaultClient {
  readonly #secrets = new Map<string, VaultPayload>();

  public async write(path: string, payload: VaultPayload) {
    this.#secrets.set(path, payload);
  }

  public async read(path: string) {
    const payload = this.#secrets.get(path);
    if (!payload) throw new Error(`Secret [${path}] not found`);
    return { data: payload };
  }

  public async delete(path: string) {
    this.#secrets.delete(path);
  }
}
