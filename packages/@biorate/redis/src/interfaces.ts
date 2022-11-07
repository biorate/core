import { IConnectorConfig, IConnector } from '@biorate/connector';
import { RedisClientOptions, createClient } from 'redis';

export type IRedisConnection = ReturnType<typeof createClient>;

export interface IRedisConfig extends IConnectorConfig {
  host: string;
  options: RedisClientOptions;
}

export type IRedisConnector = IConnector<IRedisConfig, IRedisConnection>;
