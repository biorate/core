import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { inject, container, Types, Core } from '@biorate/inversion';
import { Prometheus, IPrometheus } from '@biorate/prometheus';
import { IConfig, Config } from '@biorate/config';
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
  RDKafkaConsumerStreamConnector,
  RDKafkaHighLevelProducerConnector,
} from '../../src';

use(jestSnapshotPlugin());

export class Root extends Core() {
  @inject(Prometheus) public prometheus: IPrometheus;
  @inject(RDKafkaAdminConnector) public admin: RDKafkaAdminConnector;
  @inject(RDKafkaProducerConnector) public producer: RDKafkaProducerConnector;
  @inject(RDKafkaConsumerConnector) public consumer: RDKafkaConsumerConnector;
  @inject(RDKafkaConsumerStreamConnector)
  public consumerStream: RDKafkaConsumerStreamConnector;
  @inject(RDKafkaHighLevelProducerConnector)
  public highLevelProducer: RDKafkaHighLevelProducerConnector;
}

container.bind<IPrometheus>(Prometheus).to(Prometheus).inSingletonScope();
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
container
  .bind<RDKafkaHighLevelProducerConnector>(RDKafkaHighLevelProducerConnector)
  .toSelf()
  .inSingletonScope();
container.bind<Root>(Root).toSelf().inSingletonScope();

container.get<IConfig>(Types.Config).merge({
  RDKafkaGlobal: {
    'metadata.broker.list': 'localhost:9092',
    'group.id': 'kafka',
    'socket.keepalive.enable': true,
    'queue.buffering.max.ms': 5,
    'allow.auto.create.topics': false,
  },
  RDKafkaTopic: {
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': false,
  },
  RDKafkaAdmin: [
    {
      name: 'admin',
      global: '#{RDKafkaGlobal}',
    },
  ],
  RDKafkaProducer: [
    {
      name: 'producer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
  ],
  RDKafkaHighLevelProducer: [
    {
      name: 'highLevelProducer',
      global: '#{RDKafkaGlobal}',
      pollInterval: 0,
    },
  ],
  RDKafkaConsumer: [
    {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
    },
  ],
  RDKafkaConsumerStream: [
    {
      name: 'consumer',
      global: '#{RDKafkaGlobal}',
      topic: '#{RDKafkaTopic}',
      stream: { topics: ['test'] },
      concurrency: 1,
    },
  ],
});

export const root = <Root>container.get<Root>(Root);
