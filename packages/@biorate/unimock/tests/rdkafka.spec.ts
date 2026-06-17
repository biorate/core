import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { timer } from '@biorate/tools';
import { setup, teardown, cleanupTopic, topic, timeout } from './__mocks__/rdkafka';

let root: Awaited<ReturnType<typeof setup>>;

beforeAll(async () => {
  await cleanupTopic();
});

beforeAll(async () => {
  root = await setup();
});

afterAll(() => {
  teardown();
});

describe('@biorate/rdkafka', () => {
  it('rdkafka admin / producer / consumer', async () => {
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
  });
});
