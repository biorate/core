import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { OpenSearchConnector } from './__mocks__/opensearch';

beforeAll(() => {
  if (!container.isBound(Types.Config))
    container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
});

afterAll(() => {
  for (const c of [OpenSearchConnector]) if (container.isBound(c)) container.unbind(c);
});

describe('@biorate/opensearch', () => {
  it('opensearch connector', async () => {
    container.get<IConfig>(Types.Config).merge({
      OpenSearch: [
        {
          name: 'dev',
          options: {
            node: 'https://admin:fo4Gai1phah7eexu@localhost:9200',
            ssl: { rejectUnauthorized: false },
          },
        },
      ],
    });

    container.bind(OpenSearchConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(OpenSearchConnector)
      public connector: OpenSearchConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    try {
      await root.connector.deleteIndex('unimock_test_opensearch');
    } catch {
      // index may not exist
    }

    const indexRes = await root.connector.createIndex('unimock_test_opensearch');
    expect(indexRes.acknowledged).toBe(true);

    const doc = { title: 'test', value: 42 };
    const createRes = await root.connector.indexDoc('unimock_test_opensearch', doc);
    expect(createRes.result).toBe('created');

    const getRes = await root.connector.getDoc('unimock_test_opensearch', createRes._id);
    expect(getRes.found).toBe(true);
    expect(getRes._source.title).toBe('test');
    expect(getRes._source.value).toBe(42);

    container.unbind(Root);
  });
});
