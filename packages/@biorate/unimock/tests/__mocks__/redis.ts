import { RedisConnector as RawRedisConnector } from '@biorate/redis';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class RedisConnector extends RawRedisConnector {}

const config = {
  Redis: [{ name: 'connection', options: { url: 'redis://localhost:6379' } }],
};

export const { setup, teardown } = createMockSetup(RedisConnector, config);
