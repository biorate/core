import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IRedisConfig } from '../interfaces';
import { MemoryRedisClient } from './memory-client';

export type IMemoryRedisConnection = MemoryRedisClient;

/** @description In-memory Redis connector for unit and component tests. */
@injectable()
export class MemoryRedisConnector extends Connector<IRedisConfig, IMemoryRedisConnection> {
  protected readonly namespace = 'Redis';

  protected async connect() {
    const client = new MemoryRedisClient();
    await client.connect();
    return client;
  }
}
