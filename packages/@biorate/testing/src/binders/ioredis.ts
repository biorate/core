import { IORedisConnector } from '@biorate/ioredis';
import { MemoryIORedisConnector } from '../memory/ioredis';
import { TestProfile } from '../profiles';
import { ITestBindingRegistry } from '../types';

/** @description Binds IORedis connector for the given test profile. */
export function bindIORedis(registry: ITestBindingRegistry, profile: TestProfile) {
  if (profile === 'memory') {
    registry.rebind(IORedisConnector, MemoryIORedisConnector);
  } else {
    registry.bind(IORedisConnector, IORedisConnector);
  }
}
