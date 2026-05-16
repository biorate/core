import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientConfig } from 'pg';
import * as Cursor from 'pg-cursor';
import QueryStream from 'pg-query-stream';

/** @description PostgreSQL connection type (aliases the `pg` Client class). */
export type IPgConnection = Client;

/** @description Configuration interface for PostgreSQL connector. */
export interface IPgConfig extends IConnectorConfig {
  options: ClientConfig;
}

/** @description PostgreSQL connector interface with support for cursors and query streams. */
export interface IPgConnector extends IConnector<IPgConfig, IPgConnection> {
  cursor(
    name: string,
    query: string,
    values?: any[],
    config?: Cursor.CursorQueryConfig,
  ): Cursor<any>;

  stream(
    name: string,
    query: string,
    values?: any[],
    config?: Cursor.CursorQueryConfig,
  ): QueryStream;
}
