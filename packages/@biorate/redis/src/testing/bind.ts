import { RedisConnector } from '../index';
import { MemoryRedisConnector } from './memory-connector';

export type RedisTestProfile = 'memory' | 'docker';

export interface IRedisTestBindingRegistry {
  bind(service: unknown, implementation: unknown): void;
  rebind(service: unknown, implementation: unknown): void;
}

/** @description Binds Redis connector for the given test profile. */
export function bindRedis(registry: IRedisTestBindingRegistry, profile: RedisTestProfile) {
  if (profile === 'memory') {
    registry.rebind(RedisConnector, MemoryRedisConnector);
  } else {
    registry.bind(RedisConnector, RedisConnector);
  }
}
