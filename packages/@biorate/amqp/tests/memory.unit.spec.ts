import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { AmqpConnector } from '../src';
import { bindAmqp, MemoryAmqpConnector } from '../src/testing';
import { createTestHarness, dockerEndpoints, setupBiorateTest } from '@biorate/testing';

const connectionName = dockerEndpoints.amqp.name;
const channelName = 'test';

class Root extends Core() {
  @inject(AmqpConnector) public connector!: AmqpConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['amqp'],
  binders: [bindAmqp],
});

setupBiorateTest(harness);

describe('@biorate/amqp memory', () => {
  it('publish / consume', async () => {
    const connector = harness.root.connector as MemoryAmqpConnector;
    connector.createChannel(connectionName, {
      name: channelName,
      json: true,
      setup: async (channel) => {
        await channel.assertExchange('test-exchange', 'topic');
        await channel.assertQueue('test-queue', { exclusive: true, autoDelete: true });
        await channel.bindQueue('test-queue', 'test-exchange', '#send');
        await channel.consume('test-queue', (data) => {
          expect(JSON.parse(data!.content.toString())).toEqual({ test: 1 });
        });
      },
    });
    await connector.channelReady(channelName);
    connector.channel(channelName)!.publish('test-exchange', '#send', { test: 1 });
  });
});
