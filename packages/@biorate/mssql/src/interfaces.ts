import type { IConnectorConfig, IConnector } from '@biorate/connector';
import type { config, ConnectionPool } from 'mssql';

export type IMssqlConnection = ConnectionPool;

export interface IMssqlConfig extends IConnectorConfig {
  options: config;
}

export type IMssqlConnector = IConnector<IMssqlConfig, IMssqlConnection>;
