import { IConfig } from '@biorate/config';
import { ILoader } from '@biorate/config-loader';

export * from './errors';
export * from './interfaces';

/**
 * @description Env-based config loader for [@biorate/config-loader](https://biorate.github.io/core/modules/config_loader.html)
 *
 * ### Features
 * - Env config loader middleware
 *
 * @example middleware
 * ```
 * import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
 * import { ConfigLoaderFs } from '@biorate/config-loader-env';
 *
 * export class ConfigLoader extends BaseConfigLoader {
 *   protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderEnv];
 * }
 * ```
 *
 * ### See
 *
 * [@biorate/config-loader docs](https://biorate.github.io/core/modules/config_loader.html) for details
 */

export class ConfigLoaderEnv implements ILoader {
  /**
   * @description Process
   */
  public async process(config: IConfig) {
    config.merge(process.env);
  }
}
