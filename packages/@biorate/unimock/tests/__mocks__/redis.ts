import { RedisConnector as RawRedisConnector } from '@biorate/redis';
import { Mockable } from '../../src';

@Mockable({})
export class RedisConnector extends RawRedisConnector {}
