import { expect } from 'chai';
import { range } from 'lodash';
import { root, topic } from './__mocks__';

describe('@biorate/kafkajs', function () {
  this.timeout(Infinity);

  before(async () => {
    await root.$run();
  });

  after(async () => {
    process.exit();
  });

  it('Admin #createTopics', async () => {
    await root.admin!.current!.createTopics({
      topics: [{ topic, numPartitions: 1 }],
    });
    expect(
      await root.admin!.current!.fetchTopicMetadata({ topics: [topic] }),
    ).toMatchSnapshot();
  });

  it('Admin #createPartitions', async () => {
    await root.admin!.current!.createPartitions({
      topicPartitions: [
        {
          topic,
          count: 3,
        },
      ],
    });
    expect(
      await root.admin!.current!.fetchTopicMetadata({ topics: [topic] }),
    ).toMatchSnapshot();
  });

  it('Producer #send', async () => {
    await root.producer!.current!.send({
      topic,
      messages: range(0, 20000).map((i) => ({
        key: `key ${i}`,
        value: `hello world ${i}`,
      })),
    });
  });

  it.skip('Consumer #run', (done) => {
    root.consumer!.subscribe('consumer', async (messages) => {
      await root.consumer!.unsubscribe('consumer');
      done();
    });
  });

  it('t', (done) => {
    let count = 0;
    root.consumer!.subscribe('consumer', async (messages) => {
      count += messages.length;
      console.log(count);
    });
  });

  it('Admin #deleteTopics', async () => {
    await root.admin!.current!.deleteTopics({ topics: [topic] });
  });
});
