import { Connector, IConnector } from '@biorate/connector';
import { IMssqlConfig, IMssqlConnection } from './src';

declare module '@biorate/mssql' {
  export class MssqlConnector extends Connector<IMssqlConfig, IMssqlConnection> {
    protected readonly namespace: string;
    protected connect(config: IMssqlConfig): Promise<IMssqlConnection>;
  }
}
