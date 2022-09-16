// import { expect } from 'chai';
import { timer } from '@biorate/tools';
import { Message } from 'node-rdkafka';
import { root } from './__mocks__';

describe('@biorate/rdkafka', function () {
  const topic = 'test';
  const timeout = 50e3;
  this.timeout(timeout);

  before(async () => {
    await root.$run();
    // try {
    //   await root.admin!.current!.deleteTopic(topic, timeout / 2);
    //   await timer.wait(timeout / 2);
    // } catch {}
  });

  after(async () => {
    // try {
    //   await root.admin!.current!.deleteTopic(topic, timeout / 2);
    // } catch {}
  });

  // it('AdminClient #createTopic', async () => {
  //   await root.admin!.current!.createTopic(
  //     {
  //       topic: topic,
  //       num_partitions: 1,
  //       replication_factor: 1,
  //     },
  //     timeout / 2,
  //   );
  // });

  // it('AdminClient #createPartitions', async () =>
  //   await root.admin!.current!.createPartitions(topic, 3, timeout / 2));

  it('produce / consume', (done) => {
    let interval: NodeJS.Timer;
    root.consumerStream!.current!.subscribe((message: Message | Message[]) => {
      console.log(message);
    });
    // root.consumerStream!.current!.on('data', (message) => {
    //   console.log(message);
    //   // clearInterval(interval);
    // });
    // root.consumer!.current!.subscribe([topic]);
    // // for (let i = 1000; i--; )
    // //   root.producer!.current!.produce(topic, null, Buffer.from('hello world!'));
    // root.consumer!.current!.consume()
  });

  // it('AdminClient #deleteTopic', async () =>
  //   await root.admin!.current!.deleteTopic(topic, timeout / 2));
});
