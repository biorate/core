import { Connector } from '@biorate/connector';
import { IProxyConfig, IProxyConnection } from './src/interfaces';

declare module '@biorate/proxy' {
  export class ProxyConnector extends Connector<IProxyConfig, IProxyConnection> {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Create connection
     */
    protected connect(config: IProxyConfig): Promise<IProxyConnection>;
  }
}
