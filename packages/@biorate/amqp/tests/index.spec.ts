import { expect } from 'chai';
import { Channel, ConsumeMessage } from '../src';
import { root, channelName, connectionName } from './__mocks__';

describe('@biorate/amqp', function () {
  this.timeout(3e4);

  before(async () => await root.$run());

  it('publish / consume', (done) => {
    root.connector.createChannel(connectionName, {
      name: channelName,
      json: true,
      setup: async (channel: Channel) => {
        await channel.assertExchange('test-exchange', 'topic');
        await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
        await channel.bindQueue('test-queue', 'test-exchange', '#send');
        await channel.consume('test-queue', (data: ConsumeMessage | null) => {
          expect(data?.content?.toString?.()).toMatchSnapshot();
          done();
        });
      },
    });
    root.connector.channel(channelName)!.publish('test-exchange', '#send', { test: 1 });
  });
});
