import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { promises as fs } from 'fs';
import { ConfigLoaderFsNotFoundPathError } from './errors';
import { ConfigLoader } from '@biorate/config-loader';

export * from './errors';

/**
 * @description File-based config loader
 *
 * ### Features
 * - File config loader middleware
 * - Basic configuration in config.json
 * - Env-based configuration in config.{NODE_ENV}.json
 *
 * @example ./config.json
 * ```
 * {
 *   "hello": "world"
 * }
 * ```
 *
 * @example ./index.ts
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { ConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoaderFs } from '@biorate/config-loader-fs';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.ConfigLoaderFs) public configLoaderFs: ConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ConfigLoader>(Types.ConfigLoaderFs).to(ConfigLoaderFs).inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   root.config.get('hello'); // world
 * })();
 * ```
 *
 * ### See
 *
 * [@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details
 */
@injectable()
export class ConfigLoaderFs extends ConfigLoader {
  /**
   * @description Root path
   */
  private static rootPath = process.cwd();
  /**
   * @description Change application root method. Application root is equal ***process.cwd()*** by default
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
  protected async load(file: string, namespace?: string) {
    try {
      const data = JSON.parse(
        await fs.readFile(`${ConfigLoaderFs.rootPath}/${file}.json`, 'utf-8'),
      );
      this.config.merge(namespace ? { [namespace]: data } : data);
    } catch (e: unknown) {
      console.warn(new ConfigLoaderFsNotFoundPathError(file, (<Error>e).message).message);
    }
  }
  /**
   * @description Initialize
   */
  @init() protected async initialize() {
    await this.load('package', 'package');
    await this.load('config');
    await this.load(`config.${process.env.NODE_ENV ?? 'debug'}`);
  }
}
