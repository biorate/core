import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { ElasticConnector, IElasticConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(ElasticConnector) public elasticConnector: IElasticConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<IElasticConnector>(ElasticConnector).toSelf().inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  Elastic: [
    {
      options: {
        node: 'https://admin:admin@localhost:9200',
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  ],
});
