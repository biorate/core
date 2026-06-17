import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { OpenSearchConnector as RawOpenSearchConnector } from '@biorate/opensearch';
import { Mockable } from '../../src';

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

class Root extends Core() {
  @inject(OpenSearchConnector) public connector: OpenSearchConnector;
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

export async function setup() {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(OpenSearchConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as { connector: OpenSearchConnector };
}

export function teardown() {
  container.unbind(Root);
  if (container.isBound(OpenSearchConnector)) container.unbind(OpenSearchConnector);
}
