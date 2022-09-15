import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import { RDKafkaAdminClientConnector, RDKafkaProducerConnector } from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(RDKafkaAdminClientConnector) public admin: RDKafkaAdminClientConnector;
  @inject(RDKafkaProducerConnector) public producer: RDKafkaProducerConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container
  .bind<RDKafkaAdminClientConnector>(RDKafkaAdminClientConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaProducerConnector>(RDKafkaProducerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  RDKafkaGlobal: {
    'metadata.broker.list': 'localhost:29092',
  },
  RDKafkaAdminClient: [
    {
      name: 'admin',
      type: 'AdminClient',
      global: '#{RDKafkaGlobal}',
    },
  ],
  RDKafkaProducer: [
    {
      name: 'producer',
      type: 'Producer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
