import type { JsonMask2Configs } from 'maskdata';
import { CommonMask } from './src/common-mask';

export type IMasqueradeConfig = {
  EmailMask?: IEmailMaskOptions;
  PhoneMask?: IPhoneMaskOptions;
  CardMask?: ICardMaskOptions;
  maskJSON2?: JsonMask2Configs;
} | null;

export interface IMask {
  process(text: string, options?: IMaskOptions | null): string;
}

export interface IMaskOptions {
  maskChar?: string;
  enabled?: boolean;
}

export interface IEmailMaskOptions extends IMaskOptions {
  unmaskedStartChars?: number;
  unmaskedEndChars?: number;
}

export interface IPhoneMaskOptions extends IMaskOptions {
  minDigits?: number;
}

export interface ICardMaskOptions extends IMaskOptions {
  firstDigits?: number;
  lastDigits?: number;
}

export type MaskConstructor<T extends CommonMask> = new (...args: any[]) => T;
