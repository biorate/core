import { BaseConfigLoader, ILoaderConstructor } from '../../src';
import { ConfigLoaderTest } from './config-loader-test';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderTest];
}
