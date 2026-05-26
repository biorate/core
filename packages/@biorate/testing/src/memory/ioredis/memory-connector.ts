import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IIORedisConfig } from '@biorate/ioredis';
import { MemoryIORedisClient } from './memory-client';

export type IMemoryIORedisConnection = MemoryIORedisClient;

/** @description In-memory IORedis connector for unit and component tests. */
@injectable()
export class MemoryIORedisConnector extends Connector<
  IIORedisConfig,
  IMemoryIORedisConnection
> {
  protected readonly namespace = 'IORedis';

  protected async connect() {
    const client = new MemoryIORedisClient();
    await client.connect();
    return client;
  }
}
