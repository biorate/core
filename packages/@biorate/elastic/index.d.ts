import { Connector, IConnector } from '@biorate/connector';
import { IElasticConfig, IElasticConnection } from './src';

declare module '@biorate/elastic' {
  export class ElasticConnector extends Connector<
    IElasticConfig,
    IElasticConnection
  > {
    protected readonly namespace: string;

    protected connect(config: IElasticConfig): Promise<IElasticConnection>;
  }
}
