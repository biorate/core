import { IConnectorConfig, IConnector } from '@biorate/connector';
import { RedisOptions, Redis } from 'ioredis';

/** @description IORedis connection type (aliases the `ioredis` Redis class). */
export type IIORedisConnection = Redis;

/** @description Configuration interface for IORedis connector. */
export interface IIORedisConfig extends IConnectorConfig {
  host: string;
  options: RedisOptions & {
    reconnectTimes?: number;
    reconnectTimeoutDelta?: number;
    reconnectTimeoutLimit?: number;
  };
}

/** @description IORedis connector type. */
export type IIORedisConnector = IConnector<IIORedisConfig, IIORedisConnection>;
