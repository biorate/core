import { Connector } from '@biorate/connector';
import { IMinioConfig, IMinioConnection } from './src/interfaces';

declare module '@biorate/minio' {
  export class MinioConnector extends Connector<IMinioConfig, IMinioConnection> {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Create connection
     */
    protected connect(config: IMinioConfig): Promise<IMinioConnection>;
  }
}
