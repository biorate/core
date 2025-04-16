import { Config as CommonConfig } from '@biorate/config';

export class Config extends CommonConfig {
  public all(): Record<string, any> {
    return this.templatize(this.data);
  }

  public clear() {
    this.data = {};
  }
}
