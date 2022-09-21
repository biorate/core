// import { expect } from 'chai';
import { timer } from '@biorate/tools';
import { Message } from 'node-rdkafka';
import { root } from './__mocks__';
import { assert } from 'chai';

describe('@biorate/rdkafka', function () {
  const topic = 'test';
  const timeout = 5000;
  this.timeout(Infinity);

  before(async () => {
    await root.$run();
  });

  after(async () => {
    try {
      await root.admin!.current!.deleteTopic(topic, timeout / 2);
    } catch {}
  });

  it('AdminClient #createTopic', async () => {
    await root.admin!.current!.createTopic(
      {
        topic: topic,
        num_partitions: 1,
        replication_factor: 1,
      },
      timeout / 2,
    );
  });

  it('produce', async () => {
    root.producer!.current!.produce(topic, null, Buffer.from('hello world!'));
  });

  it('consume', (done) => {
    root.consumerStream!.current!.subscribe((message: Message | Message[]) => {
      done();
    });
  });

  // after(async () => {
  //   try {
  //     await root.admin!.current!.deleteTopic(topic, timeout / 2);
  //   } catch {}
  // });

  // it('AdminClient #createPartitions', async () =>
  //   await root.admin!.current!.createPartitions(topic, 3, timeout / 2));

  // it('produce / consume', (done) => {
  //   let interval: NodeJS.Timer;
  //   root.consumerStream!.current!.subscribe((message: Message | Message[]) => {
  //     done();
  //   });
  //   // root.consumerStream!.current!.on('data', (message) => {
  //   //   console.log(message);
  //   //   // clearInterval(interval);
  //   // });
  //   root.consumer!.current!.subscribe([topic]);
  //   for (let i = 1; i--; )
  //     root.producer!.current!.produce(topic, null, Buffer.from('hello world!'));
  //   // root.consumer!.current!.consume();
  // });

  // it('AdminClient #deleteTopic', async () =>
  //   await root.admin!.current!.deleteTopic(topic, timeout / 2));
});
