import { ConfigLoader } from '@biorate/config-loader';
import { IVaultConnector } from '@biorate/vault';
import { ConfigLoaderVaultActions, IConfigLoaderVaultOption } from './src/interfaces';

declare module '@biorate/config-loader-vault' {
  export class ConfigLoaderVault extends ConfigLoader {
    /**
     * @description Vault connector dependency
     */
    protected readonly vault: IVaultConnector;
    /**
     * @description Initialize
     */
    protected initialize(): Promise<void>;
    /**
     * @description Read data from vault or from cache
     */
    protected read(option: IConfigLoaderVaultOption): Record<string, unknown>;
    /**
     * @description Cache data from vault
     */
    protected cache(
      option: IConfigLoaderVaultOption,
      data: Record<string, unknown>,
    ): Promise<void>;
    /**
     * @description Merge config method
     */
    protected [ConfigLoaderVaultActions.Merge](
      data: Record<string, unknown>,
    ): Promise<void>;
    /**
     * @description Download files method
     */
    protected [ConfigLoaderVaultActions.Download](
      data: Record<string, string>,
    ): Promise<void>;
  }
}
