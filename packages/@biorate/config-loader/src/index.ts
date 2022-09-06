import { init, inject, injectable, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
// import { UndefinedConfigPathError } from './errors';
import { IConfigLoader, IConfigLoaderItem } from './interfaces';

export * from './errors';
export * from './interfaces';

@injectable()
export abstract class ConfigLoader implements IConfigLoader {
  /**
   * @description Config dependency
   */
  @inject(Types.Config) protected readonly config: IConfig;
  /**
   * @description List of loaders
   */
  protected abstract readonly loaders: (new () => unknown & IConfigLoaderItem)[];
  /**
   * @description Initialize
   */
  @init() protected async initialize() {
    for (const Class of this.loaders) await new Class().process();
  }
}
