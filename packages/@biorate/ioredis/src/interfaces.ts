import { IConnectorConfig, IConnector } from '@biorate/connector';
import { RedisOptions, Redis } from 'ioredis';

export type IIORedisConnection = Redis;

export interface IIORedisConfig extends IConnectorConfig {
  host: string;
  options: RedisOptions;
}

export type IIORedisConnector = IConnector<IIORedisConfig, IIORedisConnection>;
