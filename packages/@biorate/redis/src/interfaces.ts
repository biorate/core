import { IConnectorConfig, IConnector } from '@biorate/connector';
import { RedisClientOptions, createClient } from 'redis';

/** @description Redis client connection instance */
export type IRedisConnection = ReturnType<typeof createClient>;

/** @description Configuration interface for Redis connector */
export interface IRedisConfig extends IConnectorConfig {
  host: string;
  options: RedisClientOptions;
}

/** @description Redis connector type combining config and connection */
export type IRedisConnector = IConnector<IRedisConfig, IRedisConnection>;
