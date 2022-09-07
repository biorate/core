import { IConfig } from '@biorate/config';
import { ILoader } from '@biorate/config-loader';
import { promises as fs } from 'fs';
import { ConfigLoaderFsNotFoundPathError } from './errors';

export * from './errors';

/**
 * @description File-based config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)
 *
 * ### Features
 * - File config loader middleware
 * - Basic configuration in config.json
 * - Env-based configuration in config.{NODE_ENV}.json
 *
 * @example middleware
 * ```
 * import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
 * import { ConfigLoaderFs } from '@biorate/config-loader-file';
 *
 * export class ConfigLoader extends BaseConfigLoader {
 *   protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderFs];
 * }
 * ```
 *
 * ### See
 *
 * [@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details
 */

export class ConfigLoaderFs implements ILoader {
  /**
   * @description Root path
   */
  private static rootPath = process.cwd();
  /**
   * @description Change application root. Application root is equal ***process.cwd()*** by default
   * @example
   * ```ts
   * FileConfig.root('/www/my-app/');
   * ```
   * @example
   * ```ts
   * container.bind<IConfig>(Types.Config)
   *  .to(FileConfig.root('/www/my-app/'))
   *  .inSingletonScope();
   * ```
   */
  public static root(path: string) {
    ConfigLoaderFs.rootPath = path;
    return this;
  }
  /**
   * @description Load file
   */
  protected async load(config: IConfig, file: string, namespace?: string) {
    try {
      const data = JSON.parse(
        await fs.readFile(`${ConfigLoaderFs.rootPath}/${file}.json`, 'utf-8'),
      );
      config.merge(namespace ? { [namespace]: data } : data);
    } catch (e: unknown) {
      console.warn(new ConfigLoaderFsNotFoundPathError(file, (<Error>e).message).message);
    }
  }
  /**
   * @description Process
   */
  public async process(config: IConfig) {
    await this.load(config, 'package', 'package');
    await this.load(config, 'config');
    await this.load(config, `config.${process.env.NODE_ENV ?? 'debug'}`);
  }
}
