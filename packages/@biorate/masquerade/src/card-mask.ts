import { CommonMask } from './common-mask';
import type { ICardMaskOptions } from '../interfaces';

export class CardMask extends CommonMask {
  protected options?: ICardMaskOptions;

  protected get firstDigits() {
    return this.options?.firstDigits ?? 6;
  }

  protected get lastDigits() {
    return this.options?.lastDigits ?? 4;
  }

  protected parse(text: string) {
    return text.replace(/\b(?:\d[ \t\-\.]*?){15,18}\d\b/g, (card) => {
      const digits = card.replace(/\D/g, '');
      const len = digits.length;
      // Check the length (standard cards: 13-19 digits)
      if (len < 13 || len > 19) return card;
      let masked = '';
      let digitCount = 0;
      for (const char of card) {
        if (/\d/.test(char)) {
          digitCount++;
          // Save the first 6 and last 4 digits
          if (digitCount <= this.firstDigits || digitCount > len - this.lastDigits) {
            masked += char;
          } else {
            masked += this.maskChar;
          }
        } else {
          masked += char;
        }
      }
      return masked;
    });
  }
}
