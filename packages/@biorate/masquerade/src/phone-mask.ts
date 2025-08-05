import { CommonMask } from './common-mask';
import type { IPhoneMaskOptions } from '../interfaces';

export class PhoneMask extends CommonMask {
  protected options?: IPhoneMaskOptions;

  protected get minDigits() {
    return this.options?.minDigits ?? 7;
  }

  protected parse(text: string) {
    return text.replace(
      /(?:\+\d{1,3}[- ]?)?\(?\d{1,4}\)?[- \.]?\d{1,4}(?:[- \.]?\d{1,9}){1,2}/g,
      (phone) => {
        const digits = phone.match(/\d/g);
        if (!digits || digits.length < this.minDigits) return phone;
        let masked = '';
        let digitCount = 0;
        const preserveCount = 4;
        for (const char of phone) {
          if (/\d/.test(char)) {
            masked += digitCount++ < digits.length - preserveCount ? this.maskChar : char;
          } else {
            masked += char;
          }
        }
        return masked;
      },
    );
  }
}
