import { CommonMask } from './common-mask';
import type { IPhoneMaskOptions } from '../interfaces';

export class PhoneMask extends CommonMask {
  protected options?: IPhoneMaskOptions;

  protected regexp = /(?:\+7|8)[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2}/g;

  protected get minDigits() {
    return this.options?.minDigits ?? 7;
  }

  protected get preserveCount() {
    return this.options?.preserveCount ?? 4;
  }

  protected parse(text: string) {
    return text.replace(this.regexp, (phone) => {
      const digits = phone.match(/\d/g);
      if (!digits || digits.length < this.minDigits) return phone;
      let masked = '';
      let digitCount = 0;
      for (const char of phone) {
        if (/\d/.test(char)) {
          masked +=
            digitCount++ < digits.length - this.preserveCount ? this.maskChar : char;
        } else {
          masked += char;
        }
      }
      return masked;
    });
  }
}
