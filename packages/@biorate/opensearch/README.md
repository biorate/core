# Elastic OpenSearch connector

Elastic OOP static interface

### Examples:

```ts
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { OpenSearchConnector, IOpenSearchConnector } from '../../src';

export class Root extends Core() {
  @inject(Types.Config) public config: IConfig;

  @inject(OpenSearchConnector) public opensearchConnector: IOpenSearchConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IOpenSearchConnector>(OpenSearchConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  OpenSearch: [
    {
      name: 'dev',
      options: {
        node: 'https://admin:admin_pass@localhost:9200',
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  ],
});

(async () => {
  root = container.get<Root>(Root);
  await root.$run();

  await root.opensearchConnector.current!.indices.create({
    index: 'test_index',
    body: {
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 1,
        },
      },
    },
  });
})();
```
