import { inject, container, Types, Core } from '@biorate/inversion';
import { Prometheus, IPrometheus } from '@biorate/prometheus';
import { IConfig, Config } from '@biorate/config';
import { Mockable, Unimock } from '@biorate/unimock';
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
  RDKafkaConsumerStreamConnector,
  RDKafkaHighLevelProducerConnector,
} from '../../src';

@Mockable('rdkafka')
class RDKafkaAdminConnectorMock extends RDKafkaAdminConnector {}

@Mockable('rdkafka')
class RDKafkaProducerConnectorMock extends RDKafkaProducerConnector {}

@Mockable('rdkafka')
class RDKafkaConsumerConnectorMock extends RDKafkaConsumerConnector {}

@Mockable('rdkafka')
class RDKafkaConsumerStreamConnectorMock extends RDKafkaConsumerStreamConnector {}

@Mockable('rdkafka')
class RDKafkaHighLevelProducerConnectorMock extends RDKafkaHighLevelProducerConnector {}

export class Root extends Core() {
  @inject(Prometheus) public prometheus: IPrometheus;
  @inject(RDKafkaAdminConnectorMock) public admin: RDKafkaAdminConnector;
  @inject(RDKafkaProducerConnectorMock) public producer: RDKafkaProducerConnector;
  @inject(RDKafkaConsumerConnectorMock) public consumer: RDKafkaConsumerConnector;
  @inject(RDKafkaConsumerStreamConnectorMock)
  public consumerStream: RDKafkaConsumerStreamConnector;
  @inject(RDKafkaHighLevelProducerConnectorMock)
  public highLevelProducer: RDKafkaHighLevelProducerConnector;
}

container.bind<IPrometheus>(Prometheus).to(Prometheus).inSingletonScope();
container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
Unimock.autoBindMockable(container, RDKafkaAdminConnectorMock);
Unimock.autoBindMockable(container, RDKafkaProducerConnectorMock);
Unimock.autoBindMockable(container, RDKafkaConsumerConnectorMock);
Unimock.autoBindMockable(container, RDKafkaConsumerStreamConnectorMock);
Unimock.autoBindMockable(container, RDKafkaHighLevelProducerConnectorMock);
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

export function getTestRoot(): Root {
  return container.get<Root>(Root);
}
