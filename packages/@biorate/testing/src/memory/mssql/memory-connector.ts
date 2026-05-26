import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IMssqlConfig } from '@biorate/mssql';
import { MemoryMssqlClient } from './memory-client';

export type IMemoryMssqlConnection = MemoryMssqlClient;

/** @description In-memory MSSQL connector for unit and component tests. */
@injectable()
export class MemoryMssqlConnector extends Connector<IMssqlConfig, IMemoryMssqlConnection> {
  protected readonly namespace = 'Mssql';

  protected async connect() {
    const client = new MemoryMssqlClient();
    await client.connect();
    return client;
  }
}
