import { merge } from 'lodash';
import { JsonMask2Configs, maskJSON2 } from 'maskdata';
import { Types, injectable, inject, init } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { CommonMask } from './common-mask';
import { MaskConstructor, IMaskOptions, IMasqueradeConfig } from '../interfaces';

export * from './common-mask';
export * from './email-mask';
export * from './phone-mask';
export * from './card-mask';
/**
 * @description
 * Masquerade provides functionality to redact sensitive info
 *
 * @example
 * ```
 * import { Masquerade } from '@biorate/masquerade';
 *
 * Masquerade.configure({ maskJSON2: { emailFields: ['email'] } });
 *
 * const result = Masquerade.processJSON({ email: 'test@email.com' });
 *
 * console.log(result); // { "email": "tes*@*******om" }
 * ```
 *
 * ```
 * import { Masquerade } from '@biorate/masquerade';
 *
 * Masquerade.use(EmailMask).use(PhoneMask).use(CardMask);
 *
 * const result = Masquerade.processString(
 *   `user@example.com, +79231231224, 4111 1111 1111 1111 (Visa), 5500-0000-0000-0004 (MC)`
 * );
 *
 * console.log(result); // u***@**********m, +*******1224, **** **** **** 1111 (Visa), ****-****-****-0004 (MC)
 * ```
 */
@injectable()
export class Masquerade {
  protected static config: IMasqueradeConfig = {};

  protected static maskers = new Map<string, CommonMask>();

  public static configure(config: IMasqueradeConfig | null) {
    if (!config) return this;
    merge(this.config, config);
    return this;
  }

  public static get maskdataEnabled() {
    return !!Masquerade.config?.maskJSON2;
  }

  public static use<T extends CommonMask>(Mask: MaskConstructor<T>) {
    this.maskers.set(Mask.name, new Mask());
    return this;
  }

  public static unuse<T extends CommonMask>(Mask: MaskConstructor<T>) {
    this.maskers.delete(Mask.name);
    return this;
  }

  public static processJSON<T extends object>(data: T, options?: JsonMask2Configs) {
    const opts = options ?? Masquerade.config?.maskJSON2;
    if (!opts) return data;
    return maskJSON2(data, opts);
  }

  public static processString(text: string, options?: IMaskOptions) {
    for (const [, mask] of Masquerade.maskers) {
      const opts =
        options ??
        <IMaskOptions>(
          (<unknown>Masquerade.config?.[<keyof IMasqueradeConfig>mask.constructor.name])
        );
      text = mask.process(text, opts);
    }
    return text;
  }

  @inject(Types.Config) protected config: IConfig;

  @init() protected initialize() {
    Masquerade.configure(this.config.get<IMasqueradeConfig | null>('Masquerade', null));
  }
}
