import { init, injectable } from '@biorate/inversion';
import { ConfigLoader } from '@biorate/config-loader';
import { path } from '@biorate/tools';
import { promises as fs } from 'fs';
import { IConfigLoaderFsOption } from './interfaces';
import { ConfigLoaderFsFileNotLoadedError } from './errors';

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
  private static directory = process.cwd();
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
    ConfigLoaderFs.directory = path;
    return this;
  }
  /**
   * @description Load file
   */
  protected async load(
    file: string,
    directory = ConfigLoaderFs.directory,
    namespace?: string,
  ) {
    try {
      const data = JSON.parse(await fs.readFile(path.create(directory, file), 'utf-8'));
      this.config.merge(namespace ? { [namespace]: data } : data);
      console.info(`ConfigLoaderFs: file [${file}] - merged`);
    } catch (e: unknown) {
      console.warn(
        new ConfigLoaderFsFileNotLoadedError(file, (<Error>e).message).message,
      );
    }
  }
  /**
   * @description Initialize
   */
  @init() protected async initialize() {
    await this.load('package.json', undefined, 'package');
    await this.load('config.json');
    await this.load(`config.${process.env.NODE_ENV ?? 'debug'}.json`);
    for (const option of this.config.get<IConfigLoaderFsOption[]>(
      this.constructor.name,
      [],
    )) {
      await this.load(option.file, option.directory, option.namespace);
    }
  }
}
