import { BaseError } from '@biorate/errors';
import { Config } from '@biorate/config';
import { Module, t as translate, TOptionsBase } from 'i18next';

declare module '@biorate/i18n' {
  export * from 'i18next';

  export function t(key: any | any[], options?: TOptionsBase): ReturnType<translate>;

  export abstract class I18n {
    protected abstract options: Record<string, unknown>;

    protected get middlewares(): Module[];

    protected initialize(): Promise<void>;
  }
}
