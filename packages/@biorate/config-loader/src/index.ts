import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { IConfigLoader, ILoaderConstructor } from './interfaces';

export * from './errors';
export * from './interfaces';

/**
 * @description Config loader abstraction
 *
 * ### Features:
 * - Common interface for load configuration from different sources
 *
 * @example ./config-loader-test.ts
 * ```
 * import { ILoader } from '@biorate/config-loader';
 * import { IConfig } from '@biorate/config';
 *
 * export class ConfigLoaderTest implements ILoader {
 *   public async process(config: IConfig) {
 *     config.set('test', 'Hello world!');
 *   }
 * }
 * ```
 *
 * @example ./config-loader.ts
 * ```
 * import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
 * import { ConfigLoaderTest } from './config-loader-test';
 *
 * export class ConfigLoader extends BaseConfigLoader {
 *   protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderTest];
 * }
 * ```
 *
 * @example ./index.ts
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { IConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoader } from './config-loader';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.ConfigLoader) public configLoader: IConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<IConfigLoader>(Types.ConfigLoader).to(ConfigLoader).inSingletonScope();
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * container.get<IConfig>(Types.Config).merge({});
 *
 * (async () => {
 *   const root = container.get<Root>(Root);
 *   await root.$run();
 *   root.config.get('test'); // Hello world!
 * })();
 * ```
 */
@injectable()
export abstract class BaseConfigLoader implements IConfigLoader {
  /**
   * @description Config dependency
   */
  @inject(Types.Config) protected readonly config: IConfig;
  /**
   * @description List of loaders
   */
  protected abstract readonly loaders: ILoaderConstructor[];
  /**
   * @description Load loader
   */
  public async load(Loader: ILoaderConstructor) {
    await new Loader().process(this.config);
  }
  /**
   * @description Initialize
   */
  @init() protected async initialize() {
    for (const Loader of this.loaders) await this.load(Loader);
  }
}
