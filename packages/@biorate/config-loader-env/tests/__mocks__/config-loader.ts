import { BaseConfigLoader, ILoaderConstructor } from '@biorate/config-loader';
import { ConfigLoaderEnv } from '../../src';

export class ConfigLoader extends BaseConfigLoader {
  protected readonly loaders: ILoaderConstructor[] = [ConfigLoaderEnv];
}
