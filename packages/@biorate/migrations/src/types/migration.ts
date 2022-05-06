import { promises as fs } from 'fs';
import { path } from '@biorate/tools';
import { init, injectable, inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
/**
 * @description Abstract migration class
 */
@injectable()
export abstract class Migration {
  @inject(Types.Config) protected config: IConfig;
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
    return (await fs.readdir(this.path(...args))).map((item) =>
      this.path(...args, item),
    );
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
    await this.process();
  }
  /**
   * @description Abstract async process method
   */
  protected abstract process(): Promise<void>;
}
