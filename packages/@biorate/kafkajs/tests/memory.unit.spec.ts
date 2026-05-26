import { expect } from 'vitest';
import { Core, inject } from '@biorate/inversion';
import { KafkaJSProducerConnector } from '@biorate/kafkajs';
import { MemoryKafkaBus } from '@biorate/testing/memory/kafkajs';
import { createTestHarness, setupBiorateTest } from '@biorate/testing';

class Root extends Core() {
  @inject(KafkaJSProducerConnector) public producer!: KafkaJSProducerConnector;
}

const harness = createTestHarness({
  root: Root,
  profile: 'memory',
  connectors: ['kafka'],
});

setupBiorateTest(harness);

describe('@biorate/kafkajs memory', () => {
  beforeEach(() => {
    MemoryKafkaBus.shared.reset();
  });

  it('publishes to in-memory topic', async () => {
    await harness.root.producer.current!.send({
      topic: 'unit-topic',
      messages: [{ value: 'hello' }],
    });
    expect(MemoryKafkaBus.shared.drain('unit-topic')).toHaveLength(1);
  });
});
