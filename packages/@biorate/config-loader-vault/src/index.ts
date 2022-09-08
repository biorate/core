import { Types, inject, init, injectable } from '@biorate/inversion';
import { IVaultConnection } from '@biorate/vault';
import { IConfig } from '@biorate/config';
import { ConfigLoader } from '@biorate/config-loader';

export * from './errors';

/**
 * @description Vault config loader
 *
 * ### Features
 * - Vault config loader
 *
 * @example ./index.ts
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IVault, Config } from '@biorate/config';
 * import { ConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoaderVault } from '@biorate/config-loader-vault';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ConfigLoader>(Types.ConfigLoaderVault).to(ConfigLoaderVault).inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   root.config.get('test'); // Hello world!
 * })();
 * ```
 *
 * ### See
 *
 * [@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details
 */
@injectable()
export class ConfigLoaderVault extends ConfigLoader {
  /**
   * @description Config dependency
   */
  @inject(Types.Config) protected readonly config: IConfig;
  /**
   * @description Vault connector dependency
   */
  @inject(Types.Vault) public vault: IVaultConnection;
  /**
   * @description Initialize
   */
  @init() protected async initialize() {}
}
