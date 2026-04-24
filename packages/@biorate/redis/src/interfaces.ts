import { IConnectorConfig, IConnector } from '@biorate/connector';
import type { RedisClientOptions, RedisClientType } from 'redis';

// Keep public types portable across install layouts (avoid exporting redis' module-augmented client type).
export type IRedisConnection = RedisClientType<any, any, any>;

export interface IRedisConfig extends IConnectorConfig {
  host: string;
  options: RedisClientOptions;
}

export type IRedisConnector = IConnector<IRedisConfig, IRedisConnection>;
