import { Connector } from '@biorate/connector';
import { IClickhouseConfig, IClickhouseConnection } from './src/interfaces';

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
  }
}
