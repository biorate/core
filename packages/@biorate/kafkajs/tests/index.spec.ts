import { expect } from 'vitest';
import { range } from 'lodash';
import { root, topic } from './__mocks__';

describe('@biorate/kafkajs', function () {
  beforeAll(async () => await root.$run());

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
    await root.producer!.send('producer', {
      topic,
      messages: range(0, 20000).map((i) => ({
        key: `key ${i}`,
        value: `hello world ${i}`,
      })),
    });
  });

  // it('Producer #transaction', async () => {
  //   const connection = root.producer!.get('producer');
  //   const transaction = await connection.transaction();
  //   console.log(1);
  //   await transaction.send({
  //     topic,
  //     messages: range(0, 10).map((i) => ({
  //       key: `key ${i}`,
  //       value: `hello world ${i}`,
  //     })),
  //   });
  //   console.log(2);
  //   await transaction.commit();
  //   console.log(3);
  // });

  it('Consumer #run', () =>
    new Promise((done) => {
      let count = 0;
      root.consumer!.subscribe('consumer', async (messages) => {
        count += messages.length;
        if (count === 20000) done(void 0);
      });
    }));

  it('Admin #deleteTopics', async () => {
    await root.admin!.current!.deleteTopics({ topics: [topic] });
  });
});
