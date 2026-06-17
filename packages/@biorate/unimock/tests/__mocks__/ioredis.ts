import { IORedisConnector as RawIORedisConnector } from '@biorate/ioredis';
import { Mockable } from '../../src';
import { createMockSetup } from './helpers';

@Mockable({})
export class IORedisConnector extends RawIORedisConnector {}

const config = {
  IORedis: [{ name: 'connection', options: { host: 'localhost', port: 6379 } }],
};

export const { setup, teardown } = createMockSetup(IORedisConnector, config);
