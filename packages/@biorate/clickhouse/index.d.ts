import { Connector } from '@biorate/connector';
import { IClickhouseConfig, IClickhouseConnection } from './src/interfaces';
import { IInsertParams, IQueryParams } from './src';
import { omit } from 'lodash';

declare module '@biorate/clickhouse' {
  export class ClickhouseConnector extends Connector<
    IClickhouseConfig,
    IClickhouseConnection
  > {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Create connection
     */
    protected connect(config: IClickhouseConfig): Promise<IClickhouseConnection>;
    /**
     * @description Make a current query
     */
    public query<T = unknown>(query: string, params?: IQueryParams): Promise<T[]>;
    /**
     * @description Make a insert
     */
    public insert(query: string, params?: IInsertParams): Promise<Object[]>;
  }
}
