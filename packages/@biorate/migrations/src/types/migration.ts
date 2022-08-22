import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { init, injectable, inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { IConnector, IConnectorConfig } from '@biorate/connector';
/**
 * @description Abstract migration class
 */
@injectable()
export abstract class Migration {
  /**
   * @description config property
   */
  @inject(Types.Config) protected config: IConfig;
  /**
   * @description connector property
   */
  protected abstract connector: IConnector<IConnectorConfig>;
  /**
   * @description Get migration type
   */
  protected get type() {
    return this.constructor.name.toLowerCase();
  }
  /**
   * @description Scan migration directory
   */
  protected async scan(...args: string[]) {
    try {
      return (await fs.readdir(this.path(...args))).map((item) =>
        this.path(...args, item),
      );
    } catch {
      return [] as string[];
    }
  }
  /**
   * @description Create path to migrations directory
   */
  protected path(...args: string[]) {
    return path.create(
      process.cwd(),
      this.config.get<string>('migrations.directory', 'migrations'),
      this.type,
      ...args,
    );
  }
  /**
   * @description Logging method
   */
  protected log(...args: string[]) {
    console.info(this.type, ...args, 'up!');
  }
  /**
   * @description Initialize method
   */
  @init() protected async initialize() {
    console.log(this.constructor.name);
    await this.process();
  }
  /**
   * @description For each migration item
   */
  protected async forEach<T extends { name: string }, C>(
    namespace: string,
    callback: (config: T, connection: C, paths: string[]) => Promise<void>,
  ) {
    for (const config of this.config.get<T[]>(namespace, [])) {
      const paths = await this.scan(config.name);
      if (!paths.length) continue;
      const connection = this.connector.connection(config.name);
      if (!connection) {
        console.info(`${namespace} connection [%s] not exists, skip...`, config.name);
        continue;
      }
      await callback(config, connection, paths);
    }
  }
  /**
   * @description For each migration item
   */
  protected async forEachPath(
    paths: string[],
    callback: (file: string, name: string) => Promise<void>,
  ) {
    for (const p of paths) await callback(p, path.basename(p));
  }
  /**
   * @description Abstract async process method
   */
  protected abstract process(): Promise<void>;
}
