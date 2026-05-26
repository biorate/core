import { Connector } from '@biorate/connector';
import { injectable } from '@biorate/inversion';
import { IClickhouseConfig } from '@biorate/clickhouse';
import { MemoryClickhouseClient } from './memory-client';

export type IMemoryClickhouseConnection = MemoryClickhouseClient;

/** @description In-memory ClickHouse connector for unit and component tests. */
@injectable()
export class MemoryClickhouseConnector extends Connector<
  IClickhouseConfig,
  IMemoryClickhouseConnection
> {
  protected readonly namespace = 'Clickhouse';

  protected async connect() {
    return new MemoryClickhouseClient();
  }
}
