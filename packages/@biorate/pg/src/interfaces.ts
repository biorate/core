import { IConnectorConfig, IConnector } from '@biorate/connector';
import { Client, ClientConfig } from 'pg';
import * as Cursor from 'pg-cursor';
import QueryStream from 'pg-query-stream';

export type IPgConnection = Client;

export interface IPgConfig extends IConnectorConfig {
  options: ClientConfig;
}

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
