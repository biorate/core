import { IConnectorConfig, IConnector } from '@biorate/connector';
import { SentinelConnectionOptions, Redis } from 'ioredis';

export type IIORedisConnection = Redis;

/** @description Configuration interface for IORedis connector. */
export interface IIORedisConfig extends IConnectorConfig {
  host: string;
  options: SentinelConnectionOptions & {
    /**
     * @description Maximum reconnect attempts before giving up
     * @default -1
     * @remarks -1 = infinite attempts
     */
    reconnectTimes?: number | undefined;
    /**
     * @description Base timeout (ms) between reconnect attempts
     * @default 30_000
     */
    reconnectTimeoutDelta?: number | undefined;
    /**
     * @description Maximum timeout (ms) between reconnect attempts
     * @default 30_000
     */
    reconnectTimeoutLimit?: number | undefined;
    /**
     * @description Enable Sentinel failover detection via subscribing to Sentinel PubSub events
     * @default true
     */
    failoverDetector?: boolean | undefined;

    /**
     * @description Enable lazy connect
     * @default true
     */
    lazyConnect?: boolean | undefined;
  };
}

/** @description IORedis connector type. */
export type IIORedisConnector = IConnector<IIORedisConfig, IIORedisConnection>;
