import { init } from '@biorate/inversion';
import { ConfigLoader } from '../../src';
import { key, value } from './';

export class ConfigLoaderTest extends ConfigLoader {
  @init() protected initialize() {
    this.config.set(key, value);
  }
}
