import { IConnectorConfig, IConnector } from '@biorate/connector';
import { ClickHouse } from 'clickhouse';
import { CoreOptions as RequestCoreOptions } from 'request';

export type IClickhouseConnection = ClickHouse;

export interface IClickhouseConfig extends IConnectorConfig {
  host: string;
  options: {
    url: string;
    port?: number;
    debug?: boolean;
    basicAuth?: {
      username: string;
      password: string;
    } | null;
    isUseGzip?: boolean;
    trimQuery?: boolean;
    usePost?: boolean;
    format?: 'json' | 'csv' | 'tsv';
    raw?: boolean;
    config?: {
      session_id?: string;
      session_timeout?: number;
      output_format_json_quote_64bit_integers?: number;
      enable_http_compression?: number;
      database?: string;
    };
    reqParams?: RequestCoreOptions;
  };
}

export type IMinioConnector = IConnector<IClickhouseConfig, IClickhouseConnection>;
