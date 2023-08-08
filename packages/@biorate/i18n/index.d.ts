import { BaseError } from '@biorate/errors';
import { IConfig } from '@biorate/config';
import { Module, Newable, NewableModule, t as translate, TOptionsBase } from 'i18next';

declare module '@biorate/i18n' {
  export * from 'i18next';

  export function t(key: any | any[], options?: TOptionsBase): ReturnType<translate>;

  export abstract class I18n {
    protected config: IConfig;

    protected abstract options: Record<string, unknown>;

    protected get middlewares(): (NewableModule<Module> | Newable<Module> | Module)[];

    protected initialize(): Promise<void>;

    public get languages(): string[];
  }
}
