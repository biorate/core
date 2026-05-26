import { RedisConnector } from '@biorate/redis';
import { MemoryRedisConnector } from '../memory/redis';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds Redis connector for the given test profile. */
export function bindRedis(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(RedisConnector, MemoryRedisConnector);
  } else {
    registry.bind(RedisConnector, RedisConnector);
  }
}
