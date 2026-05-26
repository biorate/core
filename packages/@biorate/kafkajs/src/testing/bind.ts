import { KafkaJSProducerConnector, KafkaJSConsumerConnector } from '../connectors';
import { MemoryKafkaJSProducerConnector } from './memory-producer-connector';
import { MemoryKafkaJSConsumerConnector } from './memory-consumer-connector';

export type KafkaTestProfile = 'memory' | 'docker';

export interface IKafkaTestBindingRegistry {
  bind(service: unknown, implementation: unknown): void;
  rebind(service: unknown, implementation: unknown): void;
}

/** @description Binds KafkaJS producer and consumer connectors for the given test profile. */
export function bindKafka(registry: IKafkaTestBindingRegistry, profile: KafkaTestProfile) {
  if (profile === 'memory') {
    registry.rebind(KafkaJSProducerConnector, MemoryKafkaJSProducerConnector);
    registry.rebind(KafkaJSConsumerConnector, MemoryKafkaJSConsumerConnector);
  } else {
    registry.bind(KafkaJSProducerConnector, KafkaJSProducerConnector);
    registry.bind(KafkaJSConsumerConnector, KafkaJSConsumerConnector);
  }
}
