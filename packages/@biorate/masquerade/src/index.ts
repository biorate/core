import { JsonMask2Configs, maskJSON2 } from 'maskdata';
import { Types, injectable, inject, init } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
/**
 * @description
 * Mask data configurator
 *
 * @example
 * ```
 * import { Masquerade } from '@biorate/masquerade';
 *
 * Masquerade.configure({ emailFields: ['email'] });
 *
 * const result = Masquerade.processJSON({ email: 'test@email.com' });
 *
 * console.log(result); // { "email": "tes*@*******om" }
 * ```
 */
@injectable()
export class Masquerade {
  protected static config: JsonMask2Configs | null;

  public static get enabled() {
    return !!this.config;
  }

  public static configure(config: JsonMask2Configs) {
    this.config = config;
  }

  public static processJSON<T extends object>(data: T) {
    if (!Masquerade.config) return data;
    return maskJSON2(data, Masquerade.config);
  }

  @inject(Types.Config) protected config: IConfig;

  @init() protected initialize() {
    const config = this.config.get<JsonMask2Configs | null>('Masquerade', null);
    if (!config) return;
    Masquerade.configure(config);
  }
}

export * from 'maskdata';
