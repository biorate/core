import { Connector } from '@biorate/connector';
import { IOpenSearchConfig, IOpenSearchConnection } from './src';

declare module '@biorate/opensearch' {
  export class OpenSearchConnector extends Connector<IOpenSearchConfig, IOpenSearchConnection> {
    protected readonly namespace: string;

    protected connect(config: IOpenSearchConfig): Promise<IOpenSearchConnection>;
  }
}
