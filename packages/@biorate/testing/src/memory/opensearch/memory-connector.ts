import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IOpenSearchConfig } from '@biorate/opensearch';
import { MemoryOpenSearchClient } from './memory-client';

export type IMemoryOpenSearchConnection = MemoryOpenSearchClient;

/** @description In-memory OpenSearch connector for unit and component tests. */
@injectable()
export class MemoryOpenSearchConnector extends Connector<
  IOpenSearchConfig,
  IMemoryOpenSearchConnection
> {
  protected readonly namespace = 'OpenSearch';

  protected async connect() {
    const client = new MemoryOpenSearchClient();
    await client.ping();
    return client;
  }
}
