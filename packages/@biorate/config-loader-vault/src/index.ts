import { Types, inject } from '@biorate/inversion';
import { IVaultConnection } from '@biorate/vault';
import { IConfig } from '@biorate/config';
import { ILoader } from '@biorate/config-loader';

export * from './errors';

/**
 * @description Vault config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)
 *
 * ### Features
 * - Env config loader middleware
 *
 * @example middleware
 * ```
 * import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
 * import { ConfigLoaderVault} from '@biorate/config-loader-vault';
 *
 * export class ConfigLoader extends BaseConfigLoader {
 *   protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderVault];
 * }
 * ```
 *
 * ### See
 *
 * [@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details
 */

export class ConfigLoaderVault implements ILoader {
  /**
   * @description vault connector
   */
  @inject(Types.Vault) public vault: IVaultConnection;
  /**
   * @description Process
   */
  public async process(config: IConfig) {
    //TODO:
  }
}
