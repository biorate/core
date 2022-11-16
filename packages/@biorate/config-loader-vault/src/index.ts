import { promises as fs } from 'fs';
import { dirname } from 'path';
import { Types, inject, init, injectable } from '@biorate/inversion';
import { IVaultConnector } from '@biorate/vault';
import { path } from '@biorate/tools';
import { ConfigLoader } from '@biorate/config-loader';
import { IConfigLoaderVaultOption, ConfigLoaderVaultActions } from './interfaces';
import { ConfigLoaderVaultUnknownCacheError } from './errors';

export * from './errors';

/**
 * @description Vault config loader
 *
 * ### Features
 * - Merge json data into config
 * - Download files from vault
 *
 * @example ./vault.ts
 * ```
 * import { init } from '@biorate/inversion';
 * import { VaultConnector as VaultConnectorBase } from '@biorate/vault';
 *
 * export class VaultConnector extends VaultConnectorBase {
 *   @init() protected async initialize() {
 *     await super.initialize();
 *     await this.current!.write('secret/data/config.json', {
 *       data: { hello: 'world! (merge)' },
 *     });
 *     await this.current!.write('secret/data/files.json', {
 *       data: { 'hello.txt': 'world! (download)' },
 *     });
 *   }
 * }
 * ```
 *
 * @example ./index.ts
 * ```
 * import { promises as fs } from 'fs';
 * import { path } from '@biorate/tools';
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IVaultConnector } from '@biorate/vault';
 * import { VaultConnector } from './vault';
 * import { ConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoaderVault } from '@biorate/config-loader-vault';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.Vault) public vault: IVaultConnector;
 *   @inject(Types.ConfigLoaderVault) public configLoaderVault: ConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container
 *   .bind<IVaultConnector>(Types.Vault)
 *   .to(VaultConnector)
 *   .inSingletonScope();
 * container.bind<ConfigLoader>(Types.ConfigLoaderVault).to(ConfigLoaderVault).inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({
 *   Vault: [
 *     {
 *       name: 'connection',
 *       options: {
 *         apiVersion: 'v1',
 *         endpoint: 'http://localhost:8200',
 *         token: 'admin',
 *       },
 *     },
 *   ],
 *   ConfigLoaderVault: [
 *     {
 *       action: 'merge',
 *       path: 'secret/data/config.json',
 *       connection: 'connection',
 *       cache: true,
 *     },
 *     {
 *       action: 'download',
 *       path: 'secret/data/files.json',
 *       connection: 'connection',
 *       cache: true,
 *     },
 *   ],
 * });
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *
 *   console.log(root.config.get('hello')); // world! (merge)
 *
 *   const file = await fs.readFile(
 *     path.create(process.cwd(), 'keys', 'hello.txt'),
 *     'utf-8',
 *   )
 *   console.log(file); // world! (download)
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
   * @description Vault connector dependency
   */
  @inject(Types.Vault) protected readonly vault: IVaultConnector;
  /**
   * @description Initialize
   */
  @init() protected async initialize() {
    for (const option of this.config.get<IConfigLoaderVaultOption[]>(
      this.constructor.name,
      [],
    )) {
      await this[option.action](await this.read(option), option);
    }
  }
  /**
   * @description Read data from vault or from cache
   */
  protected async read(option: IConfigLoaderVaultOption) {
    try {
      if (option.cache)
        return JSON.parse(
          await fs.readFile(path.create(process.cwd(), 'cache', option.path), 'utf-8'),
        );
    } catch {}
    const connection = this.vault.connection(option.connection);
    const { data }: { data: Record<string, unknown> } = (
      await connection.read(option.path)
    ).data;
    await this.cache(option, data);
    return data;
  }
  /**
   * @description Cache data from vault
   */
  protected async cache(option: IConfigLoaderVaultOption, data: Record<string, unknown>) {
    if (!option.cache) return;
    try {
      await fs.mkdir(path.create(process.cwd(), 'cache', dirname(option.path)), {
        recursive: true,
      });
      await fs.writeFile(
        path.create(process.cwd(), 'cache', option.path),
        JSON.stringify(data),
      );
    } catch (e) {
      console.warn(new ConfigLoaderVaultUnknownCacheError(<Error>e).message);
    }
  }
  /**
   * @description Merge config method
   */
  protected async [ConfigLoaderVaultActions.Merge](
    data: Record<string, unknown>,
    option: IConfigLoaderVaultOption,
  ) {
    this.config.merge(data);
  }
  /**
   * @description Download files method
   */
  protected async [ConfigLoaderVaultActions.Download](
    data: Record<string, string>,
    option: IConfigLoaderVaultOption,
  ) {
    const directory = option?.directory ?? 'downloads';
    for (const file in data) {
      await fs.mkdir(path.create(process.cwd(), directory), {
        recursive: true,
      });
      await fs.writeFile(path.create(process.cwd(), directory, file), data[file]);
    }
  }
}
