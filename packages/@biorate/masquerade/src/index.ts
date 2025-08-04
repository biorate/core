import { JsonMask2Configs, maskJSON2 } from 'maskdata';

class Mask {
  protected config: JsonMask2Configs | undefined;

  public configure(config: JsonMask2Configs) {
    this.config = config;
  }

  public processJSON<T extends object>(data: T) {
    if (!this.config) return data;
    return maskJSON2(data, this.config);
  }
}

export * from 'maskdata';

export const mask = new Mask();
