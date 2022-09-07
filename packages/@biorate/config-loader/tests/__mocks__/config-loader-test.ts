import { ILoader } from '../../src';
import { IConfig } from '@biorate/config';
import { key, value } from '../__mocks__';

export class ConfigLoaderTest implements ILoader {
  public async process(config: IConfig) {
    config.set(key, value);
  }
}
