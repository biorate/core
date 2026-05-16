import { IConnectorConfig, IConnector } from '@biorate/connector';
import type { NodeClickHouseClientConfigOptions } from '@clickhouse/client/dist/config';
import type { NodeClickHouseClient } from '@clickhouse/client/dist/client';

export type * from '@clickhouse/client';

/** @description Clickhouse connection type. */
export type IClickhouseConnection = NodeClickHouseClient;

/** @description Clickhouse connection config. */
export interface IClickhouseConfig extends IConnectorConfig {
  host: string;
  options: NodeClickHouseClientConfigOptions;
}

/** @description Clickhouse connector type. */
export type IClickhouseConnector = IConnector<IClickhouseConfig, IClickhouseConnection>;
