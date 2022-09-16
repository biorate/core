import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
  RDKafkaConsumerStreamConnector,
} from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(RDKafkaAdminConnector) public admin: RDKafkaAdminConnector;
  @inject(RDKafkaProducerConnector) public producer: RDKafkaProducerConnector;
  @inject(RDKafkaConsumerConnector) public consumer: RDKafkaConsumerConnector;
  @inject(RDKafkaConsumerStreamConnector) public consumerStream: RDKafkaConsumerStreamConnector;
}

container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
container.bind<RDKafkaAdminConnector>(RDKafkaAdminConnector).toSelf().inSingletonScope();
container
  .bind<RDKafkaProducerConnector>(RDKafkaProducerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaConsumerConnector>(RDKafkaConsumerConnector)
  .toSelf()
  .inSingletonScope();
container
  .bind<RDKafkaConsumerStreamConnector>(RDKafkaConsumerStreamConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  RDKafkaGlobal: {
    'metadata.broker.list': 'localhost:29092',
    'group.id': 'test',
  },
  RDKafkaTopic: {
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': false,
  },
  RDKafkaAdmin: [
    {
      name: 'admin',
      type: 'Admin',
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
  RDKafkaConsumer: [
    {
      name: 'consumer',
      type: 'Consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
    },
  ],
  RDKafkaConsumerStream: [
    {
      name: 'consumer',
      type: 'Consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
      stream: { topics: ['test'] },
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
