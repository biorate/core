import { KafkaJSConsumerConnector, KafkaJSProducerConnector } from '@biorate/kafkajs';
import { MemoryKafkaJSConsumerConnector, MemoryKafkaJSProducerConnector } from '../memory/kafkajs';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds KafkaJS producer and consumer connectors for the given test profile. */
export function bindKafka(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(KafkaJSProducerConnector, MemoryKafkaJSProducerConnector);
    registry.rebind(KafkaJSConsumerConnector, MemoryKafkaJSConsumerConnector);
  } else {
    registry.bind(KafkaJSProducerConnector, KafkaJSProducerConnector);
    registry.bind(KafkaJSConsumerConnector, KafkaJSConsumerConnector);
  }
}
