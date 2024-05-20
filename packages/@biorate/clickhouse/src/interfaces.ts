import { IConnectorConfig, IConnector } from '@biorate/connector';
import type { NodeClickHouseClientConfigOptions } from '@clickhouse/client/dist/config';
import type { NodeClickHouseClient } from '@clickhouse/client/dist/client';

export type IClickhouseConnection = NodeClickHouseClient;

export interface IClickhouseConfig extends IConnectorConfig {
  host: string;
  options: NodeClickHouseClientConfigOptions;
}

export type IClickhouseConnector = IConnector<IClickhouseConfig, IClickhouseConnection>;
