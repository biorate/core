import { CommonMask } from './common-mask';
import type { IEmailMaskOptions } from '../interfaces';

export class EmailMask extends CommonMask {
  protected options?: IEmailMaskOptions;

  protected get unmaskedEndChars() {
    return this.options?.unmaskedEndChars ?? 1;
  }

  protected get unmaskedStartChars() {
    return this.options?.unmaskedStartChars ?? 1;
  }

  protected parse(text: string) {
    return text.replace(/\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b/gi, (email) => {
      const [local, domain] = email.split('@');
      if (local.length <= 1) return email;
      return (
        local.slice(0, this.unmaskedStartChars) +
        this.maskChar.repeat(local.length - this.unmaskedStartChars) +
        '@' +
        this.maskChar.repeat(domain.length - this.unmaskedEndChars) +
        domain.slice(-this.unmaskedEndChars)
      );
    });
  }
}
