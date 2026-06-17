import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { AdminClient } from '@confluentinc/kafka-javascript';
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
} from '@biorate/rdkafka';
import { SnapshotStore, MODE_REPLAY } from '../../src';
import { Mockable } from '../../src';

@Mockable({})
export class MockAdminConnector extends RDKafkaAdminConnector {}
@Mockable({})
export class MockProducerConnector extends RDKafkaProducerConnector {}
@Mockable({})
export class MockConsumerConnector extends RDKafkaConsumerConnector {}

export const topic = 'unimock-rdkafka-test';
export const timeout = 3000;

class Root extends Core() {
  @inject(MockAdminConnector) public admin: MockAdminConnector;
  @inject(MockProducerConnector) public producer: MockProducerConnector;
  @inject(MockConsumerConnector) public consumer: MockConsumerConnector;
}

const config = {
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
  RDKafkaAdmin: [{ name: 'admin', global: '#{RDKafkaGlobal}' }],
  RDKafkaProducer: [{ name: 'producer', global: '#{RDKafkaGlobal}', pollInterval: 0 }],
  RDKafkaConsumer: [
    { name: 'consumer', global: '#{RDKafkaGlobal}', topic: '#{RDKafkaTopic}' },
  ],
};

export function cleanupTopic() {
  if (SnapshotStore.mode !== MODE_REPLAY) {
    const clean = AdminClient.create({ 'metadata.broker.list': 'localhost:9092' });
    return new Promise<void>((resolve) => {
      clean.deleteTopic(topic, timeout, () => {
        clean.disconnect();
        resolve();
      });
      setTimeout(() => {
        clean.disconnect();
        resolve();
      }, 2000);
    });
  }
  return Promise.resolve();
}

export async function setup() {
  container.get<IConfig>(Types.Config).merge(config);
  container.bind(MockAdminConnector).toSelf().inSingletonScope();
  container.bind(MockProducerConnector).toSelf().inSingletonScope();
  container.bind(MockConsumerConnector).toSelf().inSingletonScope();
  container.bind(Root).toSelf().inSingletonScope();
  const root = container.get<Root>(Root);
  await root.$run();
  return root as {
    admin: MockAdminConnector;
    producer: MockProducerConnector;
    consumer: MockConsumerConnector;
  };
}

export function teardown() {
  container.unbind(Root);
  for (const c of [MockAdminConnector, MockProducerConnector, MockConsumerConnector])
    if (container.isBound(c)) container.unbind(c);
}
