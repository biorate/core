import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { inject, container, Types, Core } from '@biorate/inversion';
import { IConfig, Config } from '@biorate/config';
import {
  RDKafkaAdminConnector,
  RDKafkaProducerConnector,
  RDKafkaConsumerConnector,
} from '@biorate/rdkafka';
import { timer } from '@biorate/tools';
import { Mockable, SnapshotStore, flushAllSnapshots } from '../src';

@Mockable({})
class MockAdminConnector extends RDKafkaAdminConnector {}
@Mockable({})
class MockProducerConnector extends RDKafkaProducerConnector {}
@Mockable({})
class MockConsumerConnector extends RDKafkaConsumerConnector {}

describe('@biorate/rdkafka', () => {
  const topic = 'unimock-rdkafka-test';
  const timeout = 3000;

  beforeAll(async () => {
    if (!container.isBound(Types.Config))
      container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
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
      RDKafkaConsumer: [
        {
          name: 'consumer',
          global: '#{RDKafkaGlobal}',
          topic: '#{RDKafkaTopic}',
        },
      ],
    });

    const { AdminClient } = await import('@confluentinc/kafka-javascript');
    const clean = AdminClient.create({ 'metadata.broker.list': 'localhost:9092' });
    await new Promise<void>((resolve) => {
      clean.deleteTopic(topic, timeout, () => resolve());
      setTimeout(() => resolve(), 2000);
    });
    clean.disconnect();
  });

  afterAll(() => {
    [MockAdminConnector, MockProducerConnector, MockConsumerConnector].forEach((c) => {
      try {
        if (container.isBound(c)) container.unbind(c);
      } catch {}
    });
  });

  it('record', async () => {
    SnapshotStore.setMode('record');

    container.bind(MockAdminConnector).toSelf().inSingletonScope();
    container.bind(MockProducerConnector).toSelf().inSingletonScope();
    container.bind(MockConsumerConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(MockAdminConnector) public admin: MockAdminConnector;
      @inject(MockProducerConnector) public producer: MockProducerConnector;
      @inject(MockConsumerConnector) public consumer: MockConsumerConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const admin = root.admin.get();
    const producer = root.producer.get();
    const consumer = root.consumer.get();

    try {
      await admin.deleteTopic(topic, timeout / 2);
    } catch {}

    await admin.createTopic(
      {
        topic,
        num_partitions: 1,
        replication_factor: 1,
      },
      timeout / 2,
    );

    producer.produce(topic, null, Buffer.from('hello rdKafka!'), null);

    consumer.subscribe([topic]);

    let messages: any[];
    while (true) {
      await timer.wait();
      messages = await consumer.consumePromise(1);
      if (messages.length) break;
    }
    consumer.commitMessageSync(messages[0]);
    consumer.unsubscribe();

    expect(messages[0].value?.toString()).toBe('hello rdKafka!');

    flushAllSnapshots();
    container.unbind(Root);
  });

  it('replay', async () => {
    SnapshotStore.setMode('replay');

    [MockAdminConnector, MockProducerConnector, MockConsumerConnector].forEach((c) => {
      try {
        if (container.isBound(c)) container.unbind(c);
      } catch {}
    });

    container.bind(MockAdminConnector).toSelf().inSingletonScope();
    container.bind(MockProducerConnector).toSelf().inSingletonScope();
    container.bind(MockConsumerConnector).toSelf().inSingletonScope();

    class Root extends Core() {
      @inject(MockAdminConnector) public admin: MockAdminConnector;
      @inject(MockProducerConnector) public producer: MockProducerConnector;
      @inject(MockConsumerConnector) public consumer: MockConsumerConnector;
    }
    container.bind(Root).toSelf().inSingletonScope();

    const root = container.get<Root>(Root);
    await root.$run();

    const messages = await root.consumer.get().consumePromise(1);
    expect(messages[0].value?.toString()).toBe('hello rdKafka!');
  });
});
