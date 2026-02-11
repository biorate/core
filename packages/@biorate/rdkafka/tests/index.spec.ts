import { expect } from 'vitest';
import { timer } from '@biorate/tools';
import { Message } from '@confluentinc/kafka-javascript';
import { root } from './__mocks__';

describe('@biorate/rdkafka', () => {
  const topic = 'test';
  const timeout = 5000;

  async function cleanup() {
    try {
      await root.admin!.current!.deleteTopic(topic, timeout / 2);
    } catch {}
  }

  beforeAll(async () => {
    await root.$run();
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('AdminClient #createTopic', async () => {
    await root.admin!.current!.createTopic(
      {
        topic,
        num_partitions: 1,
        replication_factor: 1,
      },
      timeout / 2,
    );
  });

  it('AdminClient #createPartitions', async () =>
    await root.admin!.current!.createPartitions(topic, 3, timeout / 2));

  it('produce / consume', async () => {
    root.producer!.current!.produce(topic, null, Buffer.from('hello world!'));
    root.consumer!.current!.subscribe([topic]);
    while (true) {
      await timer.wait();
      const messages = await root.consumer!.current!.consumePromise(1);
      if (!messages.length) continue;
      root.consumer!.current!.commitMessageSync(messages[0]);
      root.consumer!.current!.unsubscribe();
      break;
    }
  });

  it('produce / consume stream', (done) => {
    root.producer!.current!.produce(
      topic,
      null,
      Buffer.from('hello world!'),
      Buffer.from('key'),
      Date.now(),
      undefined,
      [{ test: '1' }],
    );
    root.consumerStream!.current!.subscribe(async (message: Message | Message[]) => {
      await root.consumerStream!.current!.unsubscribe();
      done();
    });
  });

  it('high level producer', async () => {
    const res = await root.highLevelProducer!.current!.producePromise(
      topic,
      null,
      Buffer.from('hello world!'),
      null,
      Date.now(),
    );
    expect(res).to.be.a('number');
  });

  it('metrics', async () => {
    console.log(await root.prometheus.registry.metrics());
  });
});
