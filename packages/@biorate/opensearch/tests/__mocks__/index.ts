import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { OpenSearchConnector, IOpenSearchConnector } from '../../src';

export class Root extends Core() {
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
        node: 'https://admin:fo4Gai1phah7eexu@localhost:9200',
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  ],
});

export const root = container.get<Root>(Root);
