export interface IMemoryOpenSearchIndexResponse {
  statusCode: number;
  body?: unknown;
}

/** @description In-memory OpenSearch client with a minimal indices API for component tests. */
export class MemoryOpenSearchClient {
  readonly #indices = new Set<string>();

  public async ping() {
    return true;
  }

  public readonly indices = {
    create: async (params: { index: string }) => {
      this.#indices.add(params.index);
      return { statusCode: 200, body: { acknowledged: true } };
    },
    delete: async (params: { index: string }) => {
      this.#indices.delete(params.index);
      return { statusCode: 200, body: { acknowledged: true } };
    },
  };
}
