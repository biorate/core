import { init, injectable } from '@biorate/inversion';
import { Config } from '@biorate/config';
import { readFileSync } from 'fs';
import { ConfigFileNotFoundPathError } from './errors';
export * from './errors';

/**
 * @description
 * Module for configuring the application using files,
 * extends [Config](https://biorate.github.io/core/classes/config.Config.html) base class.
 *
 * ### Features:
 * - default configuration in config.json file
 * - configuration depending on the NODE_ENV environment variable in config.{NODE_ENV}.json file
 * - package.json data access in "package" namespace
 *
 * ### How to use:
 * In ***cwd*** of you app, near package.json, create 2 files:
 * <br />
 * <br />
 *
 * ```bash
 * # config.json
 * {
 *   "app": "test"
 * }
 * ```
 * <br />
 *
 * ```bash
 * # config.debug.json:
 * {
 *   "title": "My awesome app"
 * }
 * ```
 *
 * @example
 * ```ts
 * import { Core, injectable, inject, container, Types } from '@biorate/inversion';
 * import { IConfig } from '@biorate/config';
 * import { FileConfig } from '@biorate/file-config';
 *
 * @injectable()
 * class Root extends Core() {
 *   @inject(Types.Config) public config: IConfig;
 * }
 *
 * container.bind<IConfig>(Types.Config)
 *  .to(FileConfig)
 *  .inSingletonScope();
 *
 * container.bind<Root>(Root).toSelf().inSingletonScope();
 *
 * (async () => {
 *   const root = await container.get(Root).$run();
 *
 *   console.log(root.config.get('package'));
 *   // {
 *   //   "name": "file-config-test",
 *   //   "version": "0.0.0",
 *   //   "description": "Test package.json",
 *   //   "keywords": [],
 *   //   "author": "llevkin",
 *   //   "license": "MIT"
 *   // }
 *
 *   console.log(root.config.get('app')); // test
 *   console.log(root.config.get('title')); // My awesome app
 * })();
 * ```
 */
@injectable()
export class FileConfig extends Config {
  private static _root = process.cwd();

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
    FileConfig._root = path;
    return this;
  }

  protected load(file: string, namespace?: string) {
    try {
      const data = JSON.parse(readFileSync(`${FileConfig._root}/${file}.json`, 'utf-8'));
      this.merge(namespace ? { [namespace]: data } : data);
    } catch (e: unknown) {
      console.warn(new ConfigFileNotFoundPathError(file, (<Error>e).message).message);
    }
  }

  @init() protected initialize() {
    this.load('package', 'package');
    this.load('config');
    this.load(`config.${process.env.NODE_ENV ?? 'debug'}`);
  }
}
