import { Config as CommonConfig } from '@biorate/config';

/**
 * @description Config wrapper with templatization on all() and a clear() method to reset data.
 */
export class Config extends CommonConfig {
  public all(): Record<string, any> {
    return this.templatize(this.data);
  }

  public clear() {
    this.data = {};
  }
}
