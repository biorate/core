import { IORedisConnector as RawIORedisConnector } from '@biorate/ioredis';
import { Mockable } from '../../src';

@Mockable({})
export class IORedisConnector extends RawIORedisConnector {}
