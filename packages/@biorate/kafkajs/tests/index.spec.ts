import { expect } from 'chai';
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
      messages: [
        { key: 'key 1', value: 'hello world 1' },
        { key: 'key 2', value: 'hello world 2' },
        { key: 'key 3', value: 'hello world 3' },
      ],
    });
  });

  it('Consumer #run', (done) => {
    root.consumer!.current!.subscribe({ topics: [topic], fromBeginning: true });
    root.consumer!.current!.run({
      eachBatchAutoResolve: false,
      autoCommit: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
        for (let message of batch.messages) {
          resolveOffset(message.offset);
          await heartbeat();
        }
        root.consumer!.current!.disconnect();
        done();
      },
    });
  });

  it('Admin #deleteTopics', async () => {
    await root.admin!.current!.deleteTopics({ topics: [topic] });
  });
});
