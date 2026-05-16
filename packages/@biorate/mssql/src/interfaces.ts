import type { IConnectorConfig, IConnector } from '@biorate/connector';
import type { config, ConnectionPool } from 'mssql';

/** @description MSSQL connection type (aliases the `mssql` ConnectionPool class). */
export type IMssqlConnection = ConnectionPool;

/** @description Configuration interface for MSSQL connector. */
export interface IMssqlConfig extends IConnectorConfig {
  options: config;
}

/** @description MSSQL connector type. */
export type IMssqlConnector = IConnector<IMssqlConfig, IMssqlConnection>;
