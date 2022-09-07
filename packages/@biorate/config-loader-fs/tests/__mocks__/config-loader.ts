import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderFs } from '../../src';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderFs.root(__dirname)];
}
