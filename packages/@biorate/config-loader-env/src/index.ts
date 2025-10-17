import * as dotenvx from '@dotenvx/dotenvx';
import { DotenvConfigOptions } from '@dotenvx/dotenvx';
import { init, injectable } from '@biorate/inversion';
import { ConfigLoader } from '@biorate/config-loader';
import './default-env';

/**
 * @description Env-based config loader
 *
 * ### Features
 * - Env config loader middleware
 *
 * @example ./index.ts
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { ConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoaderEnv } from '@biorate/config-loader-env';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.ConfigLoaderEnv) public configLoaderEnv: ConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ConfigLoader>(Types.ConfigLoaderEnv).to(ConfigLoaderEnv).inSingletonScope();
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
export class ConfigLoaderEnv extends ConfigLoader {
  /**
   * @description Dotenv config
   */
  protected dotenvxConfig: DotenvConfigOptions = {
    override: true,
    ignore: ['MISSING_ENV_FILE'],
    path: ['.env', `.env.${process.env.ENV}`],
  };
  /**
   * @description Initialize
   */
  @init() protected initialize() {
    dotenvx.config(this.dotenvxConfig);
    this.config.merge(process.env);
    console.info(`ConfigLoaderEnv: environment - merged`);
  }
}
