import { AmqpConnector } from '@biorate/amqp';
import { MemoryAmqpConnector } from '../memory/amqp';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds AMQP connector for the given test profile. */
export function bindAmqp(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(AmqpConnector, MemoryAmqpConnector);
  } else {
    registry.bind(AmqpConnector, AmqpConnector);
  }
}
