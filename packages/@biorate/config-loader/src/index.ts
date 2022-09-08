import { inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';

/**
 * @description Config loader abstraction
 *
 * ### Features:
 * - Common interface for load configuration from different sources
 *
 * @example ./config-loader-test.ts
 * ```
 * import { init } from '@biorate/inversion';
 * import { ConfigLoader } from '../../src';
 * import { key, value } from './';
 *
 * export class ConfigLoaderTest extends ConfigLoader {
 *   @init() protected initialize() {
 *     this.config.set(key, value);
 *   }
 * }
 * ```
 *
 * @example ./index.ts
 * ```
 * import { inject, container, Types, Core } from '@biorate/inversion';
 * import { IConfig, Config } from '@biorate/config';
 * import { ConfigLoader } from '@biorate/config-loader';
 * import { ConfigLoaderTest } from './config-loader-test';
 *
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 *   @inject(Types.ConfigLoaderTest) public configLoaderTest: ConfigLoader;
 * }
 *
 * container.bind<IConfig>(Types.Config).to(Config).inSingletonScope();
 * container.bind<ConfigLoader>(Types.ConfigLoaderTest).to(ConfigLoaderTest).inSingletonScope();
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
export abstract class ConfigLoader {
  /**
   * @description Config dependency
   */
  @inject(Types.Config) protected readonly config: IConfig;
  /**
   * @description Initialize
   */
  protected abstract initialize(): Promise<void> | void;
}
