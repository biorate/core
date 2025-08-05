import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import type { IMask, IMaskOptions } from '../interfaces';

export abstract class CommonMask implements IMask {
  @inject(Types.Config) protected config: IConfig;

  protected abstract options?: IMaskOptions | null;

  protected get name() {
    return this.constructor.name;
  }

  protected get maskChar() {
    return this.options?.maskChar ?? '*';
  }

  protected get enabled() {
    return this.options?.enabled ?? true;
  }

  public process(text: string, options?: IMaskOptions) {
    if (!this.enabled) return text;
    this.options = options;
    return this.parse(text);
  }

  protected abstract parse(text: string): string;
}
