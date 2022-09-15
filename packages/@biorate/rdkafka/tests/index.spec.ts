// import { expect } from 'chai';
import { timer } from '@biorate/tools';
import { root } from './__mocks__';

describe('@biorate/rdkafka', function () {
  const topic = 'test1';
  const timeout = 5e3;
  this.timeout(timeout);

  before(async () => {
    await root.$run();
    try {
      await root.admin!.connection('admin').deleteTopic(topic, timeout / 2);
      await timer.wait(timeout / 2);
    } catch {}
  });

  after(async () => {
    try {
      await root.admin!.connection('admin').deleteTopic(topic, timeout / 2);
    } catch {}
  });

  it('AdminClient #createTopic', async () => {
    await root.admin!.connection('admin').createTopic(
      {
        topic: topic,
        num_partitions: 1,
        replication_factor: 1,
      },
      timeout / 2,
    );
  });

  it('AdminClient #createPartitions', async () =>
    await root.admin!.connection('admin').createPartitions(topic, 3, timeout / 2));

  it('produce / consume', async () => {
    // for (let i = 1000; i--; )
    //   root
    //     .producer!.connection('producer')
    //     .produce(topic, null, Buffer.from('hello world!'));
    // await timer.wait(timeout / 2);
  });

  it('AdminClient #deleteTopic', async () =>
    await root.admin!.connection('admin').deleteTopic(topic, timeout / 2));
});
