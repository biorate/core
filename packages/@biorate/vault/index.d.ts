import { Connector } from '@biorate/connector';
import { IVaultConfig, IVaultConnection } from './src/interfaces';

declare module '@biorate/vault' {
  export class VaultConnector extends Connector<IVaultConfig, IVaultConnection> {
    /**
     * @description Namespace path for fetching configuration
     */
    protected readonly namespace: string;
    /**
     * @description Create connection
     */
    protected connect(config: IVaultConfig): Promise<IVaultConnection>;
  }
}
