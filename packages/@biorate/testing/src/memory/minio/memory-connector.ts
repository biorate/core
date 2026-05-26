import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IMinioConfig } from '@biorate/minio';
import { MemoryMinioClient } from './memory-client';

export type IMemoryMinioConnection = MemoryMinioClient;

/** @description In-memory MinIO connector for unit and component tests. */
@injectable()
export class MemoryMinioConnector extends Connector<IMinioConfig, IMemoryMinioConnection> {
  protected readonly namespace = 'Minio';

  protected async connect() {
    const client = new MemoryMinioClient();
    await client.listBuckets();
    return client;
  }
}
