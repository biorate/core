import { Connector } from '@biorate/connector';
import { IHaproxyConfig, IHaproxyConnection } from './src/interfaces';

declare module '@biorate/haproxy' {
  export class HaproxyConnector extends Connector<IHaproxyConfig, IHaproxyConnection> {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Create connection
     */
    protected connect(config: IHaproxyConfig): Promise<IHaproxyConnection>;
    /**
     * @description Make path
     */
    protected path(config: IHaproxyConfig, ext: string): string;
    /**
     * @description Cleanup files
     */
    protected cleanup(config: IHaproxyConfig): void;
    /**
     * @description Create config file
     */
    protected createConfig(config: IHaproxyConfig): string;
    /**
     * @description Destructor
     */
    protected destructor(): Promise<void>;
  }
}
