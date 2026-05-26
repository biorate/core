import { AmqpConnector } from '../index';
import { MemoryAmqpConnector } from './memory-connector';

export type AmqpTestProfile = 'memory' | 'docker';

export interface IAmqpTestBindingRegistry {
  bind(service: unknown, implementation: unknown): void;
  rebind(service: unknown, implementation: unknown): void;
}

/** @description Binds AMQP connector for the given test profile. */
export function bindAmqp(registry: IAmqpTestBindingRegistry, profile: AmqpTestProfile) {
  if (profile === 'memory') {
    registry.rebind(AmqpConnector, MemoryAmqpConnector);
  } else {
    registry.bind(AmqpConnector, AmqpConnector);
  }
}
