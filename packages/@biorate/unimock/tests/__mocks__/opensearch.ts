import { OpenSearchConnector as RawOpenSearchConnector } from '@biorate/opensearch';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class OpenSearchConnector extends RawOpenSearchConnector {
  public async createIndex(name: string) {
    const res = await this.current!.indices.create({ index: name });
    return res.body as { acknowledged: boolean; index: string };
  }

  public async deleteIndex(name: string) {
    const res = await this.current!.indices.delete({ index: name });
    return res.body as { acknowledged: boolean };
  }

  public async indexDoc(index: string, body: Record<string, unknown>) {
    const res = await this.current!.index({ index, body });
    return res.body as { _id: string; result: string };
  }

  public async getDoc(index: string, id: string) {
    const res = await this.current!.get({ index, id });
    return res.body as { found: boolean; _source: Record<string, unknown> };
  }
}

const config = {
  OpenSearch: [
    {
      name: 'dev',
      options: {
        node: 'https://admin:fo4Gai1phah7eexu@localhost:9200',
        ssl: { rejectUnauthorized: false },
      },
    },
  ],
};

export const { setup, teardown } = createMockSetup(OpenSearchConnector, config);
